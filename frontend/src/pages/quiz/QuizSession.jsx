import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams  } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  getAllTopics,
  getAllChapters,
  getAllQuestions,
  getQuestionById,
  saveAnswer,
} from "../../api/quizApi";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";

// ── Animations ────────────────────────────────────────────────────────────────
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulseAnim = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.06); }
`;

// ── Layout ────────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const Navbar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.textPrimary};
  span { color: ${({ theme }) => theme.colors.primary}; }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const LogoutBtn = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.35rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: ${({ theme }) => theme.fonts.body};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.errorLight};
  }
`;

const Main = styled.main`
  max-width: 780px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
`;

// ── Setup Screen ──────────────────────────────────────────────────────────────
const SetupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  animation: ${fadeSlideUp} 0.4s ease both;
`;

const SetupHeading = styled.div`
  text-align: center;
`;

const SetupTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  background: linear-gradient(135deg, #7C3AED, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const SetupSub = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const SectionLabel = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 1.1em;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.875rem;
`;

const SelectCard = styled.button`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : theme.colors.surface};
  border: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.25rem 1rem;
  min-height: 90px;
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  line-height: 1.3;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textPrimary};
  box-shadow: ${({ $active, theme }) => $active ? theme.shadows.glow : "none"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  word-break: break-word;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.primaryLight};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
  &:active { transform: translateY(0); }
`;

const CardEmoji = styled.span`
  font-size: 1.6rem;
`;

const EmptyMsg = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const StartRow = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
`;

// ── Quiz Screen ───────────────────────────────────────────────────────────────
const QuizWrapper = styled.div`
  animation: ${fadeSlideUp} 0.35s ease both;
`;

const QuizTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const ProgressInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const TimerBadge = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ $urgent, theme }) =>
    $urgent ? theme.colors.error : theme.colors.textPrimary};
  background: ${({ $urgent, theme }) =>
    $urgent ? theme.colors.errorLight : theme.colors.surfaceAlt};
  border: 1.5px solid ${({ $urgent, theme }) =>
    $urgent ? theme.colors.error : theme.colors.border};
  padding: 0.25rem 0.875rem;
  border-radius: ${({ theme }) => theme.radii.full};
  min-width: 60px;
  text-align: center;
  animation: ${({ $urgent }) => $urgent ? pulseAnim : "none"} 0.5s ease infinite;
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 5px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: ${({ theme }) => theme.radii.full};
  margin-bottom: 1.75rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: linear-gradient(90deg, #7C3AED, #F59E0B);
  border-radius: ${({ theme }) => theme.radii.full};
  transition: width 0.4s ease;
`;

const QuestionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 2rem 1.75rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  animation: ${fadeSlideUp} 0.3s ease both;
`;

const QuestionTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const QuestionText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1.75rem;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const OptionBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.1rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  transition: all ${({ theme }) => theme.transitions.fast};
  background: ${({ $correct, $wrong, theme }) =>
    $correct ? theme.colors.successLight :
    $wrong   ? theme.colors.errorLight   :
               theme.colors.surfaceAlt};
  border: 2px solid ${({ $correct, $wrong, theme }) =>
    $correct ? theme.colors.success :
    $wrong   ? theme.colors.error   :
               theme.colors.border};
  color: ${({ $correct, $wrong, theme }) =>
    $correct ? theme.colors.success :
    $wrong   ? theme.colors.error   :
               theme.colors.textPrimary};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.textPrimary};
    transform: translateX(3px);
  }
`;

const OptionLabel = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ExplanationBox = styled.div`
  margin-top: 1.25rem;
  padding: 0.875rem 1rem;
  background: ${({ theme }) => theme.colors.accentLight};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  animation: ${fadeSlideUp} 0.3s ease both;
  line-height: 1.6;
  strong { color: ${({ theme }) => theme.colors.accent}; }
`;

// ── Results Screen ────────────────────────────────────────────────────────────
const ResultsWrapper = styled.div`
  animation: ${fadeSlideUp} 0.4s ease both;
`;

const ResultsCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ScoreBig = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 5rem;
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ $color }) => $color};
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const ScoreSubtitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const ScoreEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0 2.5rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem 1.5rem;
  min-width: 80px;
`;

const StatNum = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ $color }) => $color || "inherit"};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

const ResultsBtns = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const diffVariant = { easy: "success", medium: "accent", hard: "error" };

const getScoreEmoji = (pct) => {
  if (pct === 100) return "🏆";
  if (pct >= 80)   return "🌟";
  if (pct >= 60)   return "👍";
  if (pct >= 40)   return "😅";
  return "💪";
};

const getScoreColor = (pct) => {
  if (pct >= 70) return "#10B981";
  if (pct >= 40) return "#F59E0B";
  return "#EF4444";
};

// ══════════════════════════════════════════════════════════════════════════════
const QuizSession = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const [screen, setScreen] = useState("setup");

  // Setup
  const [topics, setTopics]               = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [chapters, setChapters]           = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [starting, setStarting]           = useState(false);

  // Quiz
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loadingQ, setLoadingQ]           = useState(false);
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [timer, setTimer]                 = useState(30);
  const [answered, setAnswered]           = useState(false);
  const [selectedId, setSelectedId]       = useState(null);
  const [correctCount, setCorrectCount]   = useState(0);
  const [wrongCount, setWrongCount]       = useState(0);
  const [skippedCount, setSkippedCount]   = useState(0);

  // Refs — never go stale inside closures
  const questionIdsRef  = useRef([]);
  const currentIndexRef = useRef(0);
  const answeredRef     = useRef(false);
  const isMounted       = useRef(true);
  const timerRef        = useRef(null);
  const advanceRef      = useRef(null);
  const prefilledRef    = useRef(false);

  const [searchParams] = useSearchParams();

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      isMounted.current = false;
      clearInterval(timerRef.current);
      clearTimeout(advanceRef.current);
    };
  }, []);

  // ── Fetch topics ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllTopics();
        setTopics(res.data || []);
        const urlTopicId = searchParams.get("topicId");
        if (urlTopicId) setSelectedTopicId(urlTopicId);
      } catch (e) {
        console.error("topics:", e);
      } finally {
        setLoadingTopics(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch chapters when topic changes ─────────────────────────────────────
 useEffect(() => {
    if (!selectedTopicId) { setChapters([]); setSelectedChapterId(null); return; }
    (async () => {
      setLoadingChapters(true);
      setSelectedChapterId(null);
      try {
        const res = await getAllChapters(selectedTopicId);
        setChapters(res.data || []);
        const urlChapterId = searchParams.get("chapterId");
        if (urlChapterId && !prefilledRef.current) {
          const found = (res.data || []).find((c) => c.id === urlChapterId);
          if (found) setSelectedChapterId(urlChapterId);
          prefilledRef.current = true;
        }
      } catch (e) {
        console.error("chapters:", e);
      } finally {
        setLoadingChapters(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopicId]);

  // ── Stop timer ────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  // ── Schedule advance to next question ────────────────────────────────────
  const scheduleAdvance = useCallback(() => {
    clearTimeout(advanceRef.current);
    advanceRef.current = setTimeout(() => {
      const next = currentIndexRef.current + 1;
      if (next < questionIdsRef.current.length) {
        currentIndexRef.current = next;
        setCurrentIndex(next);
        // eslint-disable-next-line no-use-before-define
        loadQuestion(questionIdsRef.current[next]);
      } else {
        stopTimer();
        setScreen("results");
      }
    }, 1600);
  }, [stopTimer]); // eslint-disable-line

  // ── Load a single question ────────────────────────────────────────────────
  const loadQuestion = useCallback(async (id) => {
    stopTimer();
    setLoadingQ(true);
    setCurrentQuestion(null);
    setAnswered(false);
    setSelectedId(null);
    answeredRef.current = false;
    try {
      const res = await getQuestionById(id);
      if (res?.data) {
        setCurrentQuestion(res.data);
        // Start fresh timer
        clearInterval(timerRef.current);
        setTimer(30);
        timerRef.current = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              if (!answeredRef.current) {
                answeredRef.current = true;
                setAnswered(true);
                setSkippedCount(c => c + 1);
                scheduleAdvance();
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (e) {
      console.error("loadQuestion:", e);
    } finally {
     setLoadingQ(false);
    }
  }, [stopTimer, scheduleAdvance]);

  // ── Start quiz ────────────────────────────────────────────────────────────
  const handleStart = async () => {
    if (!selectedChapterId || starting) return;
    setStarting(true);
    try {
      const res = await getAllQuestions(selectedChapterId);
      const ids = (res.data || []).map(q => q.id);
      if (ids.length === 0) { alert("No questions in this chapter yet."); return; }

      questionIdsRef.current  = ids;
      currentIndexRef.current = 0;
      answeredRef.current     = false;
      setCurrentIndex(0);
      setCorrectCount(0);
      setWrongCount(0);
      setSkippedCount(0);
      setCurrentQuestion(null);
      setAnswered(false);
      setSelectedId(null);
      setScreen("quiz");
      await loadQuestion(ids[0]);
    } catch (e) {
      console.error("start:", e);
    } finally {
      if (isMounted.current) setStarting(false);
    }
  };

  // ── Answer ────────────────────────────────────────────────────────────────
  const handleAnswer = (optId) => {
    if (answeredRef.current || !currentQuestion) return;
    stopTimer();
    answeredRef.current = true;
    setAnswered(true);
    setSelectedId(optId);
    const opt = currentQuestion.options.find(o => o.id === optId);
    if (opt?.is_correct) setCorrectCount(c => c + 1);
    else setWrongCount(c => c + 1);
    saveAnswer({ question_id: currentQuestion.id, selected_option_id: optId })
      .catch(console.error);
    scheduleAdvance();
  };

  // ── Play again ────────────────────────────────────────────────────────────
  const handlePlayAgain = () => {
    stopTimer();
    clearTimeout(advanceRef.current);
    questionIdsRef.current  = [];
    currentIndexRef.current = 0;
    answeredRef.current     = false;
    setScreen("setup");
    setSelectedTopicId(null);
    setSelectedChapterId(null);
    setCurrentQuestion(null);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSkippedCount(0);
    setAnswered(false);
    setSelectedId(null);
    setTimer(30);
  };

  // ── Shared navbar ─────────────────────────────────────────────────────────
  const NavBar = (
    <Navbar>
      <Logo>Quiz<span>Arena</span></Logo>
      <NavRight>
        <UserName>{user?.name}</UserName>
        <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
      </NavRight>
    </Navbar>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // SETUP SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === "setup") return (
    <Page>
      {NavBar}
      <Main>
        <SetupWrapper>
          <SetupHeading>
            <SetupTitle>🎯 QuizArena</SetupTitle>
            <SetupSub>Choose a topic and chapter to begin</SetupSub>
          </SetupHeading>

          <div>
            <SectionLabel>Select Topic</SectionLabel>
            {loadingTopics
              ? <Loader label="Loading topics…" />
              : topics.length === 0
                ? <EmptyMsg>No topics available yet.</EmptyMsg>
                : <CardGrid>
                    {topics.map(t => (
                      <SelectCard
                        key={t.id}
                        $active={selectedTopicId === t.id}
                        onClick={() => setSelectedTopicId(t.id)}
                      >
                        {t.icon && <CardEmoji>{t.icon}</CardEmoji>}
                        {t.name}
                      </SelectCard>
                    ))}
                  </CardGrid>
            }
          </div>

          {selectedTopicId && (
            <div>
              <SectionLabel>Select Chapter</SectionLabel>
              {loadingChapters
                ? <Loader label="Loading chapters…" />
                : chapters.length === 0
                  ? <EmptyMsg>No chapters in this topic yet.</EmptyMsg>
                  : <CardGrid>
                      {chapters.map(c => (
                        <SelectCard
                          key={c.id}
                          $active={selectedChapterId === c.id}
                          onClick={() => setSelectedChapterId(c.id)}
                        >
                          {c.name}
                        </SelectCard>
                      ))}
                    </CardGrid>
              }
            </div>
          )}

          {selectedChapterId && (
            <StartRow>
              <Button size="lg" onClick={handleStart} disabled={starting}>
                {starting ? "Loading…" : "Start Quiz →"}
              </Button>
            </StartRow>
          )}
        </SetupWrapper>
      </Main>
    </Page>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // QUIZ SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === "quiz") {
    const total  = questionIdsRef.current.length;
    const pct    = total > 0 ? (currentIndex / total) * 100 : 0;
    const urgent = timer <= 7;

    return (
      <Page>
        {NavBar}
        <Main>
          <QuizWrapper>
            <QuizTopBar>
              <ProgressInfo>Question {currentIndex + 1} of {total}</ProgressInfo>
              <TimerBadge $urgent={urgent}>{timer}s</TimerBadge>
            </QuizTopBar>

            <ProgressTrack>
              <ProgressFill $pct={pct} />
            </ProgressTrack>

            {loadingQ && <Loader label="Loading question…" />}

            {!loadingQ && currentQuestion && (
              <QuestionCard key={currentQuestion.id}>
                <QuestionTop>
                  <Badge variant={diffVariant[currentQuestion.difficulty] || "muted"}>
                    {currentQuestion.difficulty || "medium"}
                  </Badge>
                </QuestionTop>

                <QuestionText>{currentQuestion.question_text}</QuestionText>

                <OptionsList>
                  {currentQuestion.options.map((opt, i) => {
                    const isSelected  = selectedId === opt.id;
                    const showCorrect = answered && opt.is_correct;
                    const showWrong   = answered && isSelected && !opt.is_correct;
                    return (
                      <OptionBtn
                        key={opt.id}
                        $correct={showCorrect}
                        $wrong={showWrong}
                        disabled={answered}
                        onClick={() => handleAnswer(opt.id)}
                      >
                        <OptionLabel>{String.fromCharCode(65 + i)}</OptionLabel>
                        {opt.option_text}
                      </OptionBtn>
                    );
                  })}
                </OptionsList>

                {answered && currentQuestion.explanation && (
                  <ExplanationBox>
                    <strong>💡 Explanation: </strong>
                    {currentQuestion.explanation}
                  </ExplanationBox>
                )}
              </QuestionCard>
            )}

            {!loadingQ && !currentQuestion && (
              <EmptyMsg>Could not load question. Please wait…</EmptyMsg>
            )}
          </QuizWrapper>
        </Main>
      </Page>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RESULTS SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === "results") {
    const total = questionIdsRef.current.length;
    const pct   = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const color = getScoreColor(pct);
    const emoji = getScoreEmoji(pct);

    return (
      <Page>
        {NavBar}
        <Main>
          <ResultsWrapper>
            <ResultsCard>
              <ScoreEmoji>{emoji}</ScoreEmoji>
              <ScoreBig $color={color}>{pct}%</ScoreBig>
              <ScoreSubtitle>{correctCount} out of {total} correct</ScoreSubtitle>

              <StatsRow>
                <StatItem>
                  <StatNum $color="#10B981">{correctCount}</StatNum>
                  <StatLabel>Correct</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNum $color="#EF4444">{wrongCount}</StatNum>
                  <StatLabel>Wrong</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNum $color="#94A3B8">{skippedCount}</StatNum>
                  <StatLabel>Skipped</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNum>{total}</StatNum>
                  <StatLabel>Total</StatLabel>
                </StatItem>
              </StatsRow>

              <ResultsBtns>
                <Button variant="outline" onClick={handlePlayAgain}>Play Again</Button>
                <Button onClick={() => navigate("/")}>Dashboard</Button>
              </ResultsBtns>
            </ResultsCard>
          </ResultsWrapper>
        </Main>
      </Page>
    );
  }

  return null;
};

export default QuizSession;
