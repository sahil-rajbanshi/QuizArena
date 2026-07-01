import React, { useState, useEffect, useRef, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { getAllTopics, getAllChapters } from "../../api/quizApi";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

// ----- Animations -----
const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const expandIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ----- Styled Components -----
const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const Navbar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(6px);
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
  }
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  cursor: default;

  span:first-child {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  span:last-child {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  span {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 0.25rem 0;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow ${({ theme }) => theme.transitions.base},
    border-color ${({ theme }) => theme.transitions.base};
  animation: ${fadeSlideUp} 0.5s ease forwards;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  opacity: 0;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primaryLight};
  }

  &.expanded {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  line-height: 1;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin: 0 0 0.25rem 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ExpandIcon = styled.span`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: transform ${({ theme }) => theme.transitions.base};
  transform: ${({ $expanded }) => ($expanded ? "rotate(180deg)" : "rotate(0deg)")};
`;

const ChaptersContainer = styled.div`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease-in-out, padding 0.35s ease;
  padding: 0 1.5rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};

  &.open {
    max-height: 2000px;
    padding: 1rem 1.5rem 1.5rem;
  }
`;

const ChapterList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ChapterItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  animation: ${expandIn} 0.3s ease forwards;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
`;

const ChapterInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChapterName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const ChapterDescription = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  display: block;
  margin-top: 0.1rem;
`;

const StartButton = styled(Button)`
  flex-shrink: 0;

  @media (max-width: 480px) {
    align-self: flex-start;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const ChapterLoader = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 0;
`;

// ----- Component -----
const Topics = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [errorTopics, setErrorTopics] = useState(null);

  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [chaptersCache, setChaptersCache] = useState({});
  const [chapterLoading, setChapterLoading] = useState({});

  // Fetch all topics on mount
  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const res = await getAllTopics();
        if (res.success) {
          setTopics(res.data || []);
        } else {
          setErrorTopics("Failed to load topics.");
        }
      } catch (err) {
        setErrorTopics("An error occurred while loading topics.");
      } finally {
        setLoadingTopics(false);
      }
    };
    fetchTopics();
  }, []);

  // Fetch chapters for a specific topic
  const fetchChaptersForTopic = useCallback(
    async (topicId) => {
      if (chaptersCache[topicId]?.fetched) return;
      setChapterLoading((prev) => ({ ...prev, [topicId]: true }));
      try {
        const res = await getAllChapters(topicId);
        if (res.success) {
          setChaptersCache((prev) => ({
            ...prev,
            [topicId]: { chapters: res.data || [], fetched: true },
          }));
        } else {
          // On error, store empty and mark fetched to avoid retry?
          setChaptersCache((prev) => ({
            ...prev,
            [topicId]: { chapters: [], fetched: true },
          }));
        }
      } catch (err) {
        setChaptersCache((prev) => ({
          ...prev,
          [topicId]: { chapters: [], fetched: true },
        }));
      } finally {
        setChapterLoading((prev) => {
          const newState = { ...prev };
          delete newState[topicId];
          return newState;
        });
      }
    },
    [chaptersCache]
  );

  const handleToggleTopic = (topicId) => {
    if (expandedTopicId === topicId) {
      setExpandedTopicId(null);
    } else {
      setExpandedTopicId(topicId);
      // Fetch chapters if not yet cached
      if (!chaptersCache[topicId]?.fetched) {
        fetchChaptersForTopic(topicId);
      }
    }
  };

  const handleStartQuiz = (topicId, chapterId, e) => {
    e.stopPropagation();
    navigate(`/quiz?topicId=${topicId}&chapterId=${chapterId}`);
  };

  // Render loading state
  if (loadingTopics) {
    return (
      <PageWrapper>
        <Container>
          <Loader />
        </Container>
      </PageWrapper>
    );
  }

  // Render error state
  if (errorTopics) {
    return (
      <PageWrapper>
        <Container>
          <EmptyState>{errorTopics}</EmptyState>
        </Container>
      </PageWrapper>
    );
  }

  // No topics
  if (topics.length === 0) {
    return (
      <PageWrapper>
        <Container>
          <EmptyState>No topics yet</EmptyState>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar>
        <Logo>
          <span>Quiz</span>
          <span>Arena</span>
        </Logo>
        <NavRight>
          {user && <span>Welcome, {user.name || user.email}</span>}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </NavRight>
      </Navbar>

      <Container>
        <Header>
          <Title>Browse Topics</Title>
          <Subtitle>Pick a topic to explore its chapters</Subtitle>
        </Header>

        <Grid>
          {topics.map((topic, index) => {
            const isExpanded = expandedTopicId === topic.id;
            const cached = chaptersCache[topic.id];
            const chapters = cached?.chapters || [];
            const hasChapters = chapters.length > 0;
            const isLoadingChapters = chapterLoading[topic.id] === true;
            const isFetched = cached?.fetched || false;

            return (
              <Card
                key={topic.id}
                $delay={`${index * 0.05}s`}
                className={isExpanded ? "expanded" : ""}
                onClick={() => handleToggleTopic(topic.id)}
              >
                <CardHeader>
                  <IconWrapper>{topic.icon || "📚"}</IconWrapper>
                  <CardInfo>
                    <CardName>{topic.name}</CardName>
                    {topic.description && (
                      <CardDescription>{topic.description}</CardDescription>
                    )}
                  </CardInfo>
                  <ExpandIcon $expanded={isExpanded}>▾</ExpandIcon>
                </CardHeader>

                <ChaptersContainer className={isExpanded ? "open" : ""}>
                  {isLoadingChapters ? (
                    <ChapterLoader>
                      <Loader size="24px" />
                    </ChapterLoader>
                  ) : isFetched ? (
                    hasChapters ? (
                      <ChapterList>
                        {chapters.map((chapter) => (
                          <ChapterItem key={chapter.id}>
                            <ChapterInfo>
                              <ChapterName>{chapter.name}</ChapterName>
                              {chapter.description && (
                                <ChapterDescription>
                                  {chapter.description}
                                </ChapterDescription>
                              )}
                            </ChapterInfo>
                            <StartButton
                              size="sm"
                              variant="primary"
                              onClick={(e) =>
                                handleStartQuiz(topic.id, chapter.id, e)
                              }
                            >
                              Start Quiz
                            </StartButton>
                          </ChapterItem>
                        ))}
                      </ChapterList>
                    ) : (
                      <EmptyState>
                        No chapters in this topic yet
                      </EmptyState>
                    )
                  ) : null}
                </ChaptersContainer>
              </Card>
            );
          })}
        </Grid>
      </Container>
    </PageWrapper>
  );
};

export default Topics;