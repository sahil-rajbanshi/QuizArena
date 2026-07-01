import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuthContext } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { getProgressSummary, getUserProgress } from "../../api/quizApi";

const floatUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  padding-top: 72px; /* space for fixed navbar */
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 2rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.4rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.error}22;
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  animation: ${floatUp} 0.5s ease both;
  margin-bottom: 2.5rem;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.25rem;
`;

const HeroSub = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  & > * {
    animation: ${floatUp} 0.5s ease both;
    &:nth-child(1) {
      animation-delay: 0.05s;
    }
    &:nth-child(2) {
      animation-delay: 0.10s;
    }
    &:nth-child(3) {
      animation-delay: 0.15s;
    }
    &:nth-child(4) {
      animation-delay: 0.20s;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  & > * {
    animation: ${floatUp} 0.5s ease both;
    &:nth-child(1) {
      animation-delay: 0.25s;
    }
    &:nth-child(2) {
      animation-delay: 0.30s;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const QuickActionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 2rem 1.5rem;
  text-decoration: none;
  transition: all 0.25s;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const QuickActionEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 0.75rem;
`;

const QuickActionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.25rem;
`;

const QuickActionDesc = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin: 0;
`;

const RecentSection = styled.section`
  animation: ${floatUp} 0.5s ease both;
  animation-delay: 0.35s;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 2rem;
  text-align: left;
`;

const RecentTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const RecentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RecentItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const RecentBadge = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $correct }) => ($correct ? "#22c55e" : "#ef4444")};
`;

const RecentTextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RecentPrimary = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
`;

const RecentSecondary = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.2rem;
  line-height: 1.3;
`;

const RecentTime = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  flex-shrink: 0;
`;

const RecentEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.base};
  text-align: center;
`;

const EmojiPlaceholder = styled.div`
  font-size: 3rem;
`;

const LoadingStat = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
`;

function formatRelativeTime(dateString) {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const remainderMins = diffMins % 60;
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) {
    return remainderMins > 0
      ? `${diffHours}h ${remainderMins}m ago`
      : `${diffHours}h ago`;
  }
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return then.toLocaleDateString();
}

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthContext();
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const [summaryData, setSummaryData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, progressRes] = await Promise.all([
          getProgressSummary(),
          getUserProgress(),
        ]);

        if (summaryRes.success) {
          setSummaryData(summaryRes.data);
        } else {
          setError("Failed to load summary data.");
        }

        if (progressRes.success) {
          setProgressData(progressRes.data);
        } else {
          setError("Failed to load progress data.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const name = user?.name || "Guest";

  // Compute stats
  const quizzesTaken = summaryData ? new Set(summaryData.map((row) => row.chapter_id)).size : 0;

  let avgScore = "—";
  if (summaryData && summaryData.length > 0) {
    const totalAccuracy = summaryData.reduce((sum, row) => sum + Number(row.accuracy), 0);
    const avg = totalAccuracy / summaryData.length;
    avgScore = Math.round(avg) + "%";
  }

  let bestStreak = 0;
  let currentStreak = 0;
  if (progressData && progressData.length > 0) {
    for (const entry of progressData) {
      if (entry.is_correct) {
        currentStreak += 1;
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }
  }

  const rank = "—";

  // Recent activity (5 most recent)
  const recentEntries = progressData ? progressData.slice(0, 5) : [];

  return (
    <Page>
      <Navbar>
        <Logo>
          Quiz<span>Arena</span>
        </Logo>
        <NavRight>
          <UserName>{name}</UserName>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavRight>
      </Navbar>

      <Container>
        <HeroSection>
          <HeroTitle>Welcome back, {name} 👋</HeroTitle>
          <HeroSub>Ready to test your knowledge?</HeroSub>
        </HeroSection>

        <StatsGrid>
          <StatCard>
            {loading ? (
              <LoadingStat>...</LoadingStat>
            ) : (
              <StatValue>{quizzesTaken}</StatValue>
            )}
            <StatLabel>Quizzes Taken</StatLabel>
          </StatCard>
          <StatCard>
            {loading ? (
              <LoadingStat>...</LoadingStat>
            ) : (
              <StatValue>{avgScore}</StatValue>
            )}
            <StatLabel>Avg Score</StatLabel>
          </StatCard>
          <StatCard>
            {loading ? (
              <LoadingStat>...</LoadingStat>
            ) : (
              <StatValue>{bestStreak}</StatValue>
            )}
            <StatLabel>Best Streak</StatLabel>
          </StatCard>
          <StatCard>
            {loading ? (
              <LoadingStat>...</LoadingStat>
            ) : (
              <StatValue title="Coming soon">{rank}</StatValue>
            )}
            <StatLabel>Rank</StatLabel>
          </StatCard>
        </StatsGrid>

        <QuickActionsGrid>
          <QuickActionCard to="/quiz">
            <QuickActionEmoji>🎯</QuickActionEmoji>
            <QuickActionTitle>Start a Quiz</QuickActionTitle>
            <QuickActionDesc>Challenge yourself with a new quiz</QuickActionDesc>
          </QuickActionCard>
          <QuickActionCard to="/topics">
            <QuickActionEmoji>📚</QuickActionEmoji>
            <QuickActionTitle>Browse Topics</QuickActionTitle>
            <QuickActionDesc>Explore quizzes by subject</QuickActionDesc>
          </QuickActionCard>
        </QuickActionsGrid>

        <RecentSection>
          <RecentTitle>Recent Activity</RecentTitle>
          {recentEntries.length === 0 ? (
            <RecentEmpty>
              <EmojiPlaceholder>📭</EmojiPlaceholder>
              <span>No quizzes taken yet. Start one above!</span>
            </RecentEmpty>
          ) : (
            <RecentList>
              {recentEntries.map((entry) => {
                const truncatedQuestion =
                  entry.question_text && entry.question_text.length > 50
                    ? entry.question_text.slice(0, 50) + "..."
                    : entry.question_text || "Question";
                const primaryText =
                  (entry.topic_name || "Topic") + " → " + (entry.chapter_name || "Chapter");

                return (
                  <RecentItem key={entry.id}>
                    <RecentBadge $correct={entry.is_correct} />
                    <RecentTextContainer>
                      <RecentPrimary>{primaryText}</RecentPrimary>
                      <RecentSecondary>{truncatedQuestion}</RecentSecondary>
                    </RecentTextContainer>
                    <RecentTime>
                      {formatRelativeTime(entry.attempted_at)}
                    </RecentTime>
                  </RecentItem>
                );
              })}
            </RecentList>
          )}
        </RecentSection>
      </Container>
    </Page>
  );
};

export default Dashboard;