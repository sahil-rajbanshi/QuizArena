import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import {
  getAllTopics,
  getTopicById,
  getAllChapters,
  getAllQuestions,
  getQuestionById,
} from "../../api/quizApi";
import {
  createTopic,
  updateTopic,
  deleteTopic,
  createChapter,
  updateChapter,
  deleteChapter,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createOption,
  updateOption,
  deleteOption,
} from "../../api/adminApi";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

const floatUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  padding-top: 72px;
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
  max-width: 1440px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${floatUp} 0.4s ease both;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 320px 1fr;
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Column = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  animation: ${floatUp} 0.4s ease both;
  display: flex;
  flex-direction: column;
  max-height: 600px;

  @media (max-width: 1100px) {
    max-height: none;
  }
`;

const ColumnHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

const ColumnTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const ColumnBody = styled.div`
  padding: 0.5rem;
  overflow-y: auto;
  flex: 1;
`;

const ListItem = styled.div`
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 0.25rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : "transparent"};
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : "transparent"};
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

const ItemName = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  flex: 1;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.85rem;
  transition: all 0.15s;
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
  &.delete:hover {
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.errorLight};
  }
`;

const EmptyState = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding: 2rem 1rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const QuestionRow = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
`;

const QuestionHeader = styled.div`
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: ${({ $expanded, theme }) =>
    $expanded ? theme.colors.surfaceAlt : "transparent"};
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

const QuestionText = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  flex: 1;
  margin-right: 1rem;
`;

const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const OptionsContainer = styled.div`
  padding: 0.5rem 1rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  margin-bottom: 0.25rem;
  background: ${({ $isCorrect, theme }) =>
    $isCorrect ? theme.colors.successLight : "transparent"};
  border: 1px solid ${({ $isCorrect, theme }) =>
    $isCorrect ? theme.colors.success : "transparent"};
`;

const OptionText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const CorrectBadge = styled.span`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.success};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-left: 0.5rem;
`;

const AddOptionForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const AddOptionInput = styled.input`
  flex: 1;
  min-width: 120px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.5rem 0.75rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const Select = styled.select`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.6rem 0.75rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  width: 100%;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 0.25rem;
`;

// Helper: generate slug
const generateSlug = (name) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// Difficulty badge variant mapping
const difficultyVariant = {
  easy: "success",
  medium: "accent",
  hard: "error",
};

const AdminQuestions = () => {
  const { user, handleLogout } = useAuth();

  // ----- State for lists -----
  const [topics, setTopics] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questions, setQuestions] = useState([]);

  // ----- Selected IDs -----
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  // ----- Loading states -----
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // ----- Error states -----
  const [errorTopics, setErrorTopics] = useState(null);
  const [errorChapters, setErrorChapters] = useState(null);
  const [errorQuestions, setErrorQuestions] = useState(null);

  // ----- Modal states -----
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // for modals

  // ----- Form states for modals -----
  const [topicForm, setTopicForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    display_order: 0,
  });
  const [chapterForm, setChapterForm] = useState({
    name: "",
    slug: "",
    description: "",
    display_order: 0,
  });
  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    difficulty: "easy",
    explanation: "",
    display_order: 0,
  });

  // ----- Option form (inline) -----
  const [optionText, setOptionText] = useState("");
  const [optionIsCorrect, setOptionIsCorrect] = useState(false);
  const [addingOptionForQuestion, setAddingOptionForQuestion] = useState(null);
  const [optionError, setOptionError] = useState(null);

  // ----- Modal operation loading -----
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // ----- Options cache for expanded questions -----
  const [optionsMap, setOptionsMap] = useState({});

  // ----- Fetch topics on mount -----
  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoadingTopics(true);
    setErrorTopics(null);
    try {
      const data = await getAllTopics();
      setTopics(data.data || []);
    } catch (err) {
      setErrorTopics("Failed to load topics.");
    } finally {
      setLoadingTopics(false);
    }
  };

  // Fetch chapters when selectedTopicId changes
  useEffect(() => {
    if (selectedTopicId) {
      fetchChapters(selectedTopicId);
      setSelectedChapterId(null);
      setQuestions([]);
    } else {
      setChapters([]);
      setSelectedChapterId(null);
      setQuestions([]);
    }
  }, [selectedTopicId]);

  const fetchChapters = async (topicId) => {
    setLoadingChapters(true);
    setErrorChapters(null);
    try {
      const data = await getAllChapters(topicId);
      setChapters(data.data || []);
    } catch (err) {
      setErrorChapters("Failed to load chapters.");
    } finally {
      setLoadingChapters(false);
    }
  };

  // Fetch questions when selectedChapterId changes
  useEffect(() => {
    if (selectedChapterId) {
      fetchQuestions(selectedChapterId);
    } else {
      setQuestions([]);
    }
  }, [selectedChapterId]);

  const fetchQuestions = async (chapterId) => {
    setLoadingQuestions(true);
    setErrorQuestions(null);
    try {
      const data = await getAllQuestions(chapterId);
      setQuestions(data.data || []);
    } catch (err) {
      setErrorQuestions("Failed to load questions.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Fetch options when a question is expanded
  useEffect(() => {
    if (!expandedQuestionId) return;
    getQuestionById(expandedQuestionId).then((res) => {
      setOptionsMap((prev) => ({
        ...prev,
        [expandedQuestionId]: res.data?.options || [],
      }));
    });
  }, [expandedQuestionId]);

  // ----- Handlers for selecting items -----
  const handleSelectTopic = (topicId) => {
    setSelectedTopicId(topicId === selectedTopicId ? null : topicId);
  };

  const handleSelectChapter = (chapterId) => {
    setSelectedChapterId(chapterId === selectedChapterId ? null : chapterId);
  };

  const toggleQuestionExpand = (questionId) => {
    setExpandedQuestionId((prev) => (prev === questionId ? null : questionId));
  };

  // ----- CRUD: Topics -----
  const handleAddTopic = () => {
    setEditingItem(null);
    setTopicForm({
      name: "",
      slug: "",
      description: "",
      icon: "",
      display_order: 0,
    });
    setModalError(null);
    setTopicModalOpen(true);
  };

  const handleEditTopic = (topic) => {
    setEditingItem(topic);
    setTopicForm({
      name: topic.name || "",
      slug: topic.slug || "",
      description: topic.description || "",
      icon: topic.icon || "",
      display_order: topic.display_order ?? 0,
    });
    setModalError(null);
    setTopicModalOpen(true);
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    try {
      await deleteTopic(topicId);
      if (selectedTopicId === topicId) setSelectedTopicId(null);
      await fetchTopics();
    } catch (err) {
      alert("Failed to delete topic.");
    }
  };

  const submitTopic = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      const payload = {
        ...topicForm,
        display_order: Number(topicForm.display_order),
      };
      if (editingItem) {
        await updateTopic(editingItem.id, payload);
      } else {
        await createTopic(payload);
      }
      setTopicModalOpen(false);
      await fetchTopics();
    } catch (err) {
      setModalError(err.response?.data?.message || "Operation failed.");
    } finally {
      setModalLoading(false);
    }
  };

  // ----- CRUD: Chapters -----
  const handleAddChapter = () => {
    if (!selectedTopicId) return;
    setEditingItem(null);
    setChapterForm({
      name: "",
      slug: "",
      description: "",
      display_order: 0,
    });
    setModalError(null);
    setChapterModalOpen(true);
  };

  const handleEditChapter = (chapter) => {
    setEditingItem(chapter);
    setChapterForm({
      name: chapter.name || "",
      slug: chapter.slug || "",
      description: chapter.description || "",
      display_order: chapter.display_order ?? 0,
    });
    setModalError(null);
    setChapterModalOpen(true);
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    try {
      await deleteChapter(chapterId);
      if (selectedChapterId === chapterId) setSelectedChapterId(null);
      await fetchChapters(selectedTopicId);
    } catch (err) {
      alert("Failed to delete chapter.");
    }
  };

  const submitChapter = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      const payload = {
        ...chapterForm,
        topic_id: selectedTopicId,
        display_order: Number(chapterForm.display_order),
      };
      if (editingItem) {
        await updateChapter(editingItem.id, payload);
      } else {
        await createChapter(payload);
      }
      setChapterModalOpen(false);
      await fetchChapters(selectedTopicId);
    } catch (err) {
      setModalError(err.response?.data?.message || "Operation failed.");
    } finally {
      setModalLoading(false);
    }
  };

  // ----- CRUD: Questions -----
  const handleAddQuestion = () => {
    if (!selectedChapterId) return;
    setEditingItem(null);
    setQuestionForm({
      question_text: "",
      difficulty: "easy",
      explanation: "",
      display_order: 0,
    });
    setModalError(null);
    setQuestionModalOpen(true);
  };

  const handleEditQuestion = (question) => {
    setEditingItem(question);
    setQuestionForm({
      question_text: question.question_text || "",
      difficulty: question.difficulty || "easy",
      explanation: question.explanation || "",
      display_order: question.display_order ?? 0,
    });
    setModalError(null);
    setQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await deleteQuestion(questionId);
      if (expandedQuestionId === questionId) setExpandedQuestionId(null);
      await fetchQuestions(selectedChapterId);
    } catch (err) {
      alert("Failed to delete question.");
    }
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      const payload = {
        ...questionForm,
        chapter_id: selectedChapterId,
        display_order: Number(questionForm.display_order),
      };
      if (editingItem) {
        await updateQuestion(editingItem.id, payload);
      } else {
        await createQuestion(payload);
      }
      setQuestionModalOpen(false);
      await fetchQuestions(selectedChapterId);
    } catch (err) {
      setModalError(err.response?.data?.message || "Operation failed.");
    } finally {
      setModalLoading(false);
    }
  };

  // ----- Option inline CRUD -----
  const handleAddOption = async (questionId) => {
    if (!optionText.trim()) {
      setOptionError("Option text is required.");
      return;
    }
    setOptionError(null);
    try {
      await createOption({
        question_id: questionId,
        option_text: optionText,
        is_correct: optionIsCorrect,
      });
      setOptionText("");
      setOptionIsCorrect(false);
      // Refresh options for this question
      const res = await getQuestionById(questionId);
      setOptionsMap((prev) => ({
        ...prev,
        [questionId]: res.data?.options || [],
      }));
    } catch (err) {
      setOptionError(err.response?.data?.message || "Failed to add option.");
    }
  };

  const handleDeleteOption = async (optionId, questionId) => {
    if (!window.confirm("Delete this option?")) return;
    try {
      await deleteOption(optionId);
      const res = await getQuestionById(questionId);
      setOptionsMap((prev) => ({
        ...prev,
        [questionId]: res.data?.options || [],
      }));
    } catch (err) {
      alert("Failed to delete option.");
    }
  };

  // ----- Slug auto-generation -----
  const handleTopicNameChange = (e) => {
    const name = e.target.value;
    setTopicForm((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleChapterNameChange = (e) => {
    const name = e.target.value;
    setChapterForm((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  // ----- Render helpers -----
  const renderDifficultyBadge = (difficulty) => {
    const variant = difficultyVariant[difficulty] || "secondary";
    return <Badge variant={variant}>{difficulty}</Badge>;
  };

  return (
    <Page>
      <Navbar>
        <Logo>
          Quiz<span>Arena</span>
        </Logo>
        <NavRight>
          <UserName>{user?.name || "Admin"}</UserName>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavRight>
      </Navbar>

      <Container>
        <Header>
          <PageTitle>Admin Panel</PageTitle>
          <Badge variant="accent">Admin</Badge>
        </Header>

        <PanelGrid>
          {/* Topics Column */}
          <Column>
            <ColumnHeader>
              <ColumnTitle>Topics</ColumnTitle>
              <Button size="sm" onClick={handleAddTopic}>
                + Add
              </Button>
            </ColumnHeader>
            <ColumnBody>
              {loadingTopics && <EmptyState>Loading topics…</EmptyState>}
              {errorTopics && <EmptyState>{errorTopics}</EmptyState>}
              {!loadingTopics && !errorTopics && topics.length === 0 && (
                <EmptyState>No topics yet.</EmptyState>
              )}
              {topics.map((topic) => (
                <ListItem
                  key={topic.id}
                  $active={selectedTopicId === topic.id}
                  onClick={() => handleSelectTopic(topic.id)}
                >
                  <ItemName>
                    {topic.icon && <span style={{ marginRight: "0.5rem" }}>{topic.icon}</span>}
                    {topic.name}
                  </ItemName>
                  <ItemActions>
                    <ActionIcon onClick={(e) => { e.stopPropagation(); handleEditTopic(topic); }}>
                      ✎
                    </ActionIcon>
                    <ActionIcon className="delete" onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic.id); }}>
                      ✕
                    </ActionIcon>
                  </ItemActions>
                </ListItem>
              ))}
            </ColumnBody>
          </Column>

          {/* Chapters Column */}
          <Column>
            <ColumnHeader>
              <ColumnTitle>Chapters</ColumnTitle>
              <Button
                size="sm"
                onClick={handleAddChapter}
                disabled={!selectedTopicId}
              >
                + Add
              </Button>
            </ColumnHeader>
            <ColumnBody>
              {!selectedTopicId && <EmptyState>Select a topic</EmptyState>}
              {selectedTopicId && loadingChapters && <EmptyState>Loading chapters…</EmptyState>}
              {selectedTopicId && errorChapters && <EmptyState>{errorChapters}</EmptyState>}
              {selectedTopicId && !loadingChapters && !errorChapters && chapters.length === 0 && (
                <EmptyState>No chapters.</EmptyState>
              )}
              {chapters.map((chapter) => (
                <ListItem
                  key={chapter.id}
                  $active={selectedChapterId === chapter.id}
                  onClick={() => handleSelectChapter(chapter.id)}
                >
                  <ItemName>{chapter.name}</ItemName>
                  <ItemActions>
                    <ActionIcon onClick={(e) => { e.stopPropagation(); handleEditChapter(chapter); }}>
                      ✎
                    </ActionIcon>
                    <ActionIcon className="delete" onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter.id); }}>
                      ✕
                    </ActionIcon>
                  </ItemActions>
                </ListItem>
              ))}
            </ColumnBody>
          </Column>

          {/* Questions Column */}
          <Column>
            <ColumnHeader>
              <ColumnTitle>Questions</ColumnTitle>
              <Button
                size="sm"
                onClick={handleAddQuestion}
                disabled={!selectedChapterId}
              >
                + Add
              </Button>
            </ColumnHeader>
            <ColumnBody>
              {!selectedChapterId && <EmptyState>Select a chapter</EmptyState>}
              {selectedChapterId && loadingQuestions && <EmptyState>Loading questions…</EmptyState>}
              {selectedChapterId && errorQuestions && <EmptyState>{errorQuestions}</EmptyState>}
              {selectedChapterId && !loadingQuestions && !errorQuestions && questions.length === 0 && (
                <EmptyState>No questions.</EmptyState>
              )}
              {questions.map((question) => {
                const expanded = expandedQuestionId === question.id;
                const options = optionsMap[question.id] || [];
                return (
                  <QuestionRow key={question.id}>
                    <QuestionHeader
                      $expanded={expanded}
                      onClick={() => toggleQuestionExpand(question.id)}
                    >
                      <QuestionText>{question.question_text}</QuestionText>
                      <QuestionMeta>
                        {renderDifficultyBadge(question.difficulty)}
                        <ItemActions>
                          <ActionIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditQuestion(question);
                            }}
                          >
                            ✎
                          </ActionIcon>
                          <ActionIcon
                            className="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(question.id);
                            }}
                          >
                            ✕
                          </ActionIcon>
                        </ItemActions>
                      </QuestionMeta>
                    </QuestionHeader>
                    {expanded && (
                      <OptionsContainer>
                        {/* Options list */}
                        {options.length > 0 ? (
                          options.map((opt) => (
                            <OptionItem key={opt.id} $isCorrect={opt.is_correct}>
                              <OptionText>
                                {opt.option_text}
                                {opt.is_correct && <CorrectBadge>✓ Correct</CorrectBadge>}
                              </OptionText>
                              <ActionIcon
                                className="delete"
                                onClick={() => handleDeleteOption(opt.id, question.id)}
                              >
                                ✕
                              </ActionIcon>
                            </OptionItem>
                          ))
                        ) : (
                          <EmptyState style={{ padding: "0.5rem 0" }}>
                            No options yet.
                          </EmptyState>
                        )}
                        {/* Add option form */}
                        <AddOptionForm>
                          <AddOptionInput
                            placeholder="Option text"
                            value={optionText}
                            onChange={(e) => setOptionText(e.target.value)}
                          />
                          <CheckboxLabel>
                            <input
                              type="checkbox"
                              checked={optionIsCorrect}
                              onChange={(e) => setOptionIsCorrect(e.target.checked)}
                            />
                            Correct
                          </CheckboxLabel>
                          <Button
                            size="sm"
                            onClick={() => handleAddOption(question.id)}
                          >
                            Add
                          </Button>
                        </AddOptionForm>
                        {optionError && <ErrorText>{optionError}</ErrorText>}
                      </OptionsContainer>
                    )}
                  </QuestionRow>
                );
              })}
            </ColumnBody>
          </Column>
        </PanelGrid>
      </Container>

      {/* Topic Modal */}
      <Modal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        title={editingItem ? "Edit Topic" : "Create Topic"}
      >
        <form onSubmit={submitTopic}>
          <ModalContent>
            <Input
              label="Name"
              value={topicForm.name}
              onChange={handleTopicNameChange}
              required
            />
            <Input
              label="Slug"
              value={topicForm.slug}
              onChange={(e) => setTopicForm({ ...topicForm, slug: e.target.value })}
              required
            />
            <Input
              label="Description"
              value={topicForm.description || ""}
              onChange={(e) =>
                setTopicForm({ ...topicForm, description: e.target.value })
              }
            />
            <Input
              label="Icon (emoji)"
              value={topicForm.icon || ""}
              onChange={(e) => setTopicForm({ ...topicForm, icon: e.target.value })}
            />
            <Input
              label="Display Order"
              type="number"
              value={topicForm.display_order}
              onChange={(e) =>
                setTopicForm({
                  ...topicForm,
                  display_order: parseInt(e.target.value) || 0,
                })
              }
            />
            {modalError && <ErrorText>{modalError}</ErrorText>}
            <ModalActions>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setTopicModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={modalLoading}>
                {modalLoading ? "Saving…" : editingItem ? "Update" : "Create"}
              </Button>
            </ModalActions>
          </ModalContent>
        </form>
      </Modal>

      {/* Chapter Modal */}
      <Modal
        isOpen={chapterModalOpen}
        onClose={() => setChapterModalOpen(false)}
        title={editingItem ? "Edit Chapter" : "Create Chapter"}
      >
        <form onSubmit={submitChapter}>
          <ModalContent>
            <Input
              label="Name"
              value={chapterForm.name}
              onChange={handleChapterNameChange}
              required
            />
            <Input
              label="Slug"
              value={chapterForm.slug}
              onChange={(e) => setChapterForm({ ...chapterForm, slug: e.target.value })}
              required
            />
            <Input
              label="Description"
              value={chapterForm.description || ""}
              onChange={(e) =>
                setChapterForm({ ...chapterForm, description: e.target.value })
              }
            />
            <Input
              label="Display Order"
              type="number"
              value={chapterForm.display_order}
              onChange={(e) =>
                setChapterForm({
                  ...chapterForm,
                  display_order: parseInt(e.target.value) || 0,
                })
              }
            />
            {modalError && <ErrorText>{modalError}</ErrorText>}
            <ModalActions>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setChapterModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={modalLoading}>
                {modalLoading ? "Saving…" : editingItem ? "Update" : "Create"}
              </Button>
            </ModalActions>
          </ModalContent>
        </form>
      </Modal>

      {/* Question Modal */}
      <Modal
        isOpen={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        title={editingItem ? "Edit Question" : "Create Question"}
      >
        <form onSubmit={submitQuestion}>
          <ModalContent>
            <textarea
              style={{
                background: "#161929",
                border: "1px solid #2A2F4A",
                borderRadius: "8px",
                padding: "0.6rem 0.75rem",
                color: "#F1F5F9",
                fontSize: "0.9rem",
                width: "100%",
                minHeight: "80px",
                fontFamily: "inherit",
              }}
              placeholder="Question text"
              value={questionForm.question_text}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, question_text: e.target.value })
              }
              required
            />
            <Select
              value={questionForm.difficulty}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, difficulty: e.target.value })
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
            <textarea
              style={{
                background: "#161929",
                border: "1px solid #2A2F4A",
                borderRadius: "8px",
                padding: "0.6rem 0.75rem",
                color: "#F1F5F9",
                fontSize: "0.9rem",
                width: "100%",
                minHeight: "60px",
                fontFamily: "inherit",
              }}
              placeholder="Explanation (optional)"
              value={questionForm.explanation || ""}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, explanation: e.target.value })
              }
            />
            <Input
              label="Display Order"
              type="number"
              value={questionForm.display_order}
              onChange={(e) =>
                setQuestionForm({
                  ...questionForm,
                  display_order: parseInt(e.target.value) || 0,
                })
              }
            />
            {modalError && <ErrorText>{modalError}</ErrorText>}
            <ModalActions>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setQuestionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={modalLoading}>
                {modalLoading ? "Saving…" : editingItem ? "Update" : "Create"}
              </Button>
            </ModalActions>
          </ModalContent>
        </form>
      </Modal>
    </Page>
  );
};

export default AdminQuestions;