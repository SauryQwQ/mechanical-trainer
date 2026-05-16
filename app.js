(function () {
  const LEGACY_STORAGE_KEY = "mechanicalInterviewTrainer.v4";
  const PROFILE_STORAGE_KEY = "mechanicalInterviewTrainer.profiles.v1";
  const ALL_DECKS = "全部板块";
  const ALL_FILES = "全部文件";
  const ALL_GROUPS = "全部大类";
  const ALL_SUBJECTS = "全部科目";
  const ALL_PRIORITIES = "全部题目";
  const ALL_FAVORITES = "全部题目";
  const FAVORITES_ONLY = "只看收藏";
  const PREDICTION_DECK = "押题模块";

  const knowledgeQuestions = (Array.isArray(window.QUESTION_BANK) ? window.QUESTION_BANK : []).map((item) => ({
    ...item,
    uid: `k-${item.id}`,
    deck: item.deck || "专业知识问答",
  }));
  const translationQuestions = (Array.isArray(window.TRANSLATION_BANK) ? window.TRANSLATION_BANK : []).map((item) => ({
    ...item,
    uid: `t-${item.id}`,
  }));
  const predictionQuestions = (Array.isArray(window.PREDICTION_BANK) ? window.PREDICTION_BANK : []).map((item) => ({
    ...item,
    uid: `p-${item.id}`,
  }));
  const sentenceTranslationQuestions = (
    Array.isArray(window.SENTENCE_TRANSLATION_BANK) ? window.SENTENCE_TRANSLATION_BANK : []
  ).map((item) => ({
    ...item,
    uid: `s-${item.id}`,
  }));
  const syntheticWordQuestions = buildSyntheticWordQuestions(sentenceTranslationQuestions, translationQuestions);
  const questions = [
    ...knowledgeQuestions,
    ...predictionQuestions,
    ...translationQuestions,
    ...sentenceTranslationQuestions,
    ...syntheticWordQuestions,
  ];
  const studyQuestions = questions.filter((item) => !item.hiddenFromStudy);

  const el = {
    totalCount: document.getElementById("totalCount"),
    wrongCount: document.getElementById("wrongCount"),
    progressCount: document.getElementById("progressCount"),
    progressFill: document.getElementById("progressFill"),
    studyTab: document.getElementById("studyTab"),
    predictionTab: document.getElementById("predictionTab"),
    reviewTab: document.getElementById("reviewTab"),
    mockTab: document.getElementById("mockTab"),
    analysisTab: document.getElementById("analysisTab"),
    dataTab: document.getElementById("dataTab"),
    userSelect: document.getElementById("userSelect"),
    newUserInput: document.getElementById("newUserInput"),
    createUserBtn: document.getElementById("createUserBtn"),
    deckFilter: document.getElementById("deckFilter"),
    searchInput: document.getElementById("searchInput"),
    fileFilter: document.getElementById("fileFilter"),
    groupFilter: document.getElementById("groupFilter"),
    subjectFilter: document.getElementById("subjectFilter"),
    priorityFilter: document.getElementById("priorityFilter"),
    favoriteFilter: document.getElementById("favoriteFilter"),
    resetStudy: document.getElementById("resetStudy"),
    clearWrong: document.getElementById("clearWrong"),
    questionMeta: document.getElementById("questionMeta"),
    questionCard: document.getElementById("questionCard"),
    modeLabel: document.getElementById("modeLabel"),
    groupLabel: document.getElementById("groupLabel"),
    subjectLabel: document.getElementById("subjectLabel"),
    priorityLabel: document.getElementById("priorityLabel"),
    numberLabel: document.getElementById("numberLabel"),
    sourceLine: document.getElementById("sourceLine"),
    questionText: document.getElementById("questionText"),
    favoriteBtn: document.getElementById("favoriteBtn"),
    editAnswerBtn: document.getElementById("editAnswerBtn"),
    inputPanel: document.getElementById("inputPanel"),
    answerInputLabel: document.getElementById("answerInputLabel"),
    answerInput: document.getElementById("answerInput"),
    clearDraftBtn: document.getElementById("clearDraftBtn"),
    scoreBox: document.getElementById("scoreBox"),
    scoreValue: document.getElementById("scoreValue"),
    scoreLabel: document.getElementById("scoreLabel"),
    scoreExplain: document.getElementById("scoreExplain"),
    conceptBox: document.getElementById("conceptBox"),
    hitConcepts: document.getElementById("hitConcepts"),
    missConcepts: document.getElementById("missConcepts"),
    answerBox: document.getElementById("answerBox"),
    answerText: document.getElementById("answerText"),
    answerEditor: document.getElementById("answerEditor"),
    answerEditInput: document.getElementById("answerEditInput"),
    saveAnswerEditBtn: document.getElementById("saveAnswerEditBtn"),
    cancelAnswerEditBtn: document.getElementById("cancelAnswerEditBtn"),
    resetAnswerEditBtn: document.getElementById("resetAnswerEditBtn"),
    wordNotice: document.getElementById("wordNotice"),
    submitActions: document.getElementById("submitActions"),
    selfCheckActions: document.getElementById("selfCheckActions"),
    nextActions: document.getElementById("nextActions"),
    submitAnswerBtn: document.getElementById("submitAnswerBtn"),
    skipBtn: document.getElementById("skipBtn"),
    familiarBtn: document.getElementById("familiarBtn"),
    unclearBtn: document.getElementById("unclearBtn"),
    skipSelfCheckBtn: document.getElementById("skipSelfCheckBtn"),
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
    mockArea: document.getElementById("mockArea"),
    mockTitle: document.getElementById("mockTitle"),
    mockTimer: document.getElementById("mockTimer"),
    mockIntro: document.getElementById("mockIntro"),
    startMockBtn: document.getElementById("startMockBtn"),
    mockGroupList: document.getElementById("mockGroupList"),
    selectAllMockGroupsBtn: document.getElementById("selectAllMockGroupsBtn"),
    clearMockGroupsBtn: document.getElementById("clearMockGroupsBtn"),
    mockRangeNotice: document.getElementById("mockRangeNotice"),
    mockQuestionPanel: document.getElementById("mockQuestionPanel"),
    mockSource: document.getElementById("mockSource"),
    mockQuestionText: document.getElementById("mockQuestionText"),
    mockAnswerInput: document.getElementById("mockAnswerInput"),
    mockPrevBtn: document.getElementById("mockPrevBtn"),
    mockNextBtn: document.getElementById("mockNextBtn"),
    finishMockBtn: document.getElementById("finishMockBtn"),
    mockReport: document.getElementById("mockReport"),
    analysisArea: document.getElementById("analysisArea"),
    analysisContent: document.getElementById("analysisContent"),
    dataArea: document.getElementById("dataArea"),
    exportAllBtn: document.getElementById("exportAllBtn"),
    exportWrongBtn: document.getElementById("exportWrongBtn"),
    exportFavoriteBtn: document.getElementById("exportFavoriteBtn"),
    exportEditsBtn: document.getElementById("exportEditsBtn"),
    exportReviewBtn: document.getElementById("exportReviewBtn"),
    importBackupInput: document.getElementById("importBackupInput"),
    dataNotice: document.getElementById("dataNotice"),
  };

  const defaultState = {
    mode: "study",
    deck: ALL_DECKS,
    search: "",
    file: ALL_FILES,
    group: ALL_GROUPS,
    subject: ALL_SUBJECTS,
    priority: ALL_PRIORITIES,
    favoriteFilter: ALL_FAVORITES,
    studyIndexByFilter: {},
    wrongIds: [],
    favoriteIds: [],
    answerOverrides: {},
    drafts: {},
    timing: {},
    mockHistory: [],
    mockGroups: [],
    mockGroupsInitialized: false,
    mock: null,
    editingAnswer: false,
    reviewOrder: [],
    reviewIndex: 0,
    resultVisible: false,
    lastUserAnswer: "",
    lastScore: null,
  };

  let profileStore = loadProfileStore();
  let currentUser = profileStore.currentUser;
  let state = loadState();
  normalizeState();
  let activeQuestionUid = null;
  let questionShownAt = Date.now();
  let firstInputAt = null;
  let mockTimerId = null;

  function cloneDefaultState() {
    return JSON.parse(JSON.stringify(defaultState));
  }

  function loadProfileStore() {
    try {
      const stored = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || "null");
      if (stored && stored.profiles && stored.currentUser) return stored;
    } catch {
      // Fall through to migration/default creation.
    }

    let migrated = null;
    try {
      migrated = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
    } catch {
      migrated = null;
    }

    const initialUser = "默认用户";
    return {
      currentUser: initialUser,
      profiles: {
        [initialUser]: { ...cloneDefaultState(), ...(migrated || {}) },
      },
    };
  }

  function persistProfileStore() {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileStore));
  }

  function loadState() {
    return { ...cloneDefaultState(), ...(profileStore.profiles[currentUser] || {}) };
  }

  function saveState() {
    profileStore.currentUser = currentUser;
    profileStore.profiles[currentUser] = state;
    persistProfileStore();
  }

  function normalizeState() {
    state.wrongIds = Array.isArray(state.wrongIds) ? state.wrongIds : [];
    state.favoriteIds = Array.isArray(state.favoriteIds) ? state.favoriteIds : [];
    state.answerOverrides = state.answerOverrides && typeof state.answerOverrides === "object" ? state.answerOverrides : {};
    state.drafts = state.drafts && typeof state.drafts === "object" ? state.drafts : {};
    state.timing = state.timing && typeof state.timing === "object" ? state.timing : {};
    state.mockHistory = Array.isArray(state.mockHistory) ? state.mockHistory : [];
    state.mock = state.mock && typeof state.mock === "object" ? state.mock : null;
    const mockGroups = professionalMockGroups();
    state.mockGroups = Array.isArray(state.mockGroups) ? state.mockGroups.filter((group) => mockGroups.includes(group)) : [];
    state.mockGroupsInitialized = !!state.mockGroupsInitialized;
    if (!state.mockGroupsInitialized && mockGroups.length) {
      state.mockGroups = mockGroups.slice();
      state.mockGroupsInitialized = true;
    }
    state.search = typeof state.search === "string" ? state.search : "";
    state.favoriteFilter = state.favoriteFilter || ALL_FAVORITES;
    state.editingAnswer = false;
  }

  function unique(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function normalizeTerm(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^\u4e00-\u9fffA-Za-z0-9-]+/g, "")
      .trim();
  }

  function syntheticWordKey(english, chinese) {
    return `${normalizeTerm(english)}||${normalizeTerm(chinese)}`;
  }

  function buildSyntheticWordQuestions(sentenceItems, vocabularyItems) {
    const existing = new Set();
    vocabularyItems.forEach((item) => {
      existing.add(syntheticWordKey(item.answer, item.question));
      existing.add(syntheticWordKey(item.question, item.answer));
    });

    const items = [];
    const seen = new Set();
    sentenceItems.forEach((question) => {
      (question.alignment || []).forEach((pair) => {
        const english = question.translationDirection === "中译英" ? pair.right : pair.left;
        const chinese = question.translationDirection === "中译英" ? pair.left : pair.right;
        if (!/[A-Za-z]/.test(english || "") || !chinese) return;
        const key = syntheticWordKey(english, chinese);
        if (!key || existing.has(key) || seen.has(key)) return;
        seen.add(key);
        items.push({
          id: items.length + 1,
          uid: `sw-${key}`,
          sourceFile: question.sourceFile,
          sourceNumber: question.sourceNumber,
          deck: "专业英语翻译",
          group: "专业英语翻译",
          subject: "句子生词",
          chapter: "句子翻译生词",
          priority: "英语词汇",
          question: english,
          answer: chinese,
          translationDirection: "英译中",
          hiddenFromStudy: true,
          alignment: [{ left: english, right: chinese }],
        });
      });
    });
    return items;
  }

  function optionsFor(key, allLabel, scope) {
    return [allLabel, ...unique(scope.map((item) => item[key]))];
  }

  function scopeForDeck() {
    if (state.deck === ALL_DECKS) return studyQuestions;
    return studyQuestions.filter((item) => item.deck === state.deck);
  }

  function scopeForFile() {
    const byDeck = scopeForDeck();
    if (state.file === ALL_FILES) return byDeck;
    return byDeck.filter((item) => item.sourceFile === state.file);
  }

  function scopeForGroup() {
    const byFile = scopeForFile();
    if (state.group === ALL_GROUPS) return byFile;
    return byFile.filter((item) => item.group === state.group);
  }

  function filteredQuestions() {
    const byGroup = scopeForGroup();
    const bySubject = state.subject === ALL_SUBJECTS ? byGroup : byGroup.filter((item) => item.subject === state.subject);
    const byPriority = state.priority === ALL_PRIORITIES ? bySubject : bySubject.filter((item) => item.priority === state.priority);
    const byFavorite =
      state.favoriteFilter === FAVORITES_ONLY ? byPriority.filter((item) => state.favoriteIds.includes(item.uid)) : byPriority;
    return filterBySearch(byFavorite);
  }

  function keyForCurrentFilter() {
    return [state.deck, state.search, state.file, state.group, state.subject, state.priority, state.favoriteFilter].join("||");
  }

  function filterBySearch(list) {
    const query = normalizeSearch(state.search);
    if (!query) return list;
    return list.filter((item) => {
      const haystack = normalizeSearch(
        [item.question, effectiveAnswer(item), item.subject, item.chapter, item.group, item.priority].filter(Boolean).join(" ")
      );
      return haystack.includes(query);
    });
  }

  function normalizeSearch(value) {
    return String(value)
      .toLowerCase()
      .replace(/\s+/g, "")
      .trim();
  }

  function currentStudyQuestion() {
    const list = filteredQuestions();
    const index = Math.min(state.studyIndexByFilter[keyForCurrentFilter()] || 0, list.length);
    return list[index] || null;
  }

  function shuffle(values) {
    const copy = values.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function ensureReviewOrder() {
    const wrongSet = new Set(state.wrongIds);
    state.reviewOrder = state.reviewOrder.filter((id) => wrongSet.has(id));
    if (!state.reviewOrder.length || state.reviewIndex >= state.reviewOrder.length) {
      state.reviewOrder = shuffle(state.wrongIds);
      state.reviewIndex = 0;
    }
  }

  function currentReviewQuestion() {
    if (!state.wrongIds.length) return null;
    ensureReviewOrder();
    return questions.find((item) => item.uid === state.reviewOrder[state.reviewIndex]) || null;
  }

  function currentQuestion() {
    return state.mode === "study" ? currentStudyQuestion() : currentReviewQuestion();
  }

  function markQuestionView(question) {
    if (!question) return;
    if (activeQuestionUid !== question.uid) {
      activeQuestionUid = question.uid;
      questionShownAt = Date.now();
      firstInputAt = null;
    }
  }

  function markFirstInput() {
    if (!firstInputAt) firstInputAt = Date.now();
  }

  function recordTiming(question, score = null) {
    if (!question || !questionShownAt) return;
    const now = Date.now();
    const answerMs = Math.max(0, now - questionShownAt);
    const firstInputMs = firstInputAt ? Math.max(0, firstInputAt - questionShownAt) : answerMs;
    const current = state.timing[question.uid] || {
      attempts: 0,
      totalAnswerMs: 0,
      totalFirstInputMs: 0,
      scores: [],
      lastAt: 0,
    };
    current.attempts += 1;
    current.totalAnswerMs += answerMs;
    current.totalFirstInputMs += firstInputMs;
    current.lastAt = now;
    if (typeof score === "number") current.scores.push(score);
    state.timing[question.uid] = current;
  }

  function averageMs(question, key) {
    const item = question && state.timing[question.uid];
    if (!item || !item.attempts) return null;
    return Math.round((item[key] || 0) / item.attempts);
  }

  function formatDuration(ms) {
    if (ms == null) return "-";
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  }

  function draftFor(question) {
    return question ? state.drafts[question.uid] || "" : "";
  }

  function saveCurrentDraft() {
    const question = currentQuestion();
    if (!question || (!el.inputPanel || el.inputPanel.classList.contains("hidden"))) return;
    if (state.resultVisible && !usesDraft(question)) return;
    const value = el.answerInput.value;
    if (value) {
      state.drafts[question.uid] = value;
    } else {
      delete state.drafts[question.uid];
    }
    saveState();
  }

  function clearCurrentDraft() {
    const question = currentQuestion();
    if (!question) return;
    delete state.drafts[question.uid];
    el.answerInput.value = "";
    saveState();
    el.answerInput.focus();
  }

  function effectiveAnswer(question) {
    if (!question) return "";
    return state.answerOverrides[question.uid] || question.answer || "";
  }

  function isFavorite(question) {
    return question && state.favoriteIds.includes(question.uid);
  }

  function toggleFavorite() {
    const question = currentQuestion();
    if (!question) return;
    if (isFavorite(question)) {
      state.favoriteIds = state.favoriteIds.filter((id) => id !== question.uid);
    } else {
      state.favoriteIds.push(question.uid);
    }
    saveState();
    render();
  }

  function startAnswerEdit() {
    const question = currentQuestion();
    if (!question) return;
    state.editingAnswer = true;
    saveState();
    render();
    el.answerEditInput.focus();
  }

  function cancelAnswerEdit() {
    state.editingAnswer = false;
    saveState();
    render();
  }

  function saveAnswerEdit() {
    const question = currentQuestion();
    if (!question) return;
    const value = el.answerEditInput.value.trim();
    if (value && value !== question.answer) {
      state.answerOverrides[question.uid] = value;
    } else {
      delete state.answerOverrides[question.uid];
    }
    state.editingAnswer = false;
    resetAnswerState();
    saveState();
    render();
  }

  function resetAnswerEdit() {
    const question = currentQuestion();
    if (!question) return;
    delete state.answerOverrides[question.uid];
    state.editingAnswer = false;
    resetAnswerState();
    saveState();
    render();
  }

  function addWrong(question) {
    if (question && !state.wrongIds.includes(question.uid)) {
      state.wrongIds.push(question.uid);
      state.reviewOrder = [];
      state.reviewIndex = 0;
    }
  }

  function removeWrong(question) {
    if (!question) return;
    state.wrongIds = state.wrongIds.filter((id) => id !== question.uid);
    state.reviewOrder = state.reviewOrder.filter((id) => id !== question.uid);
    state.reviewIndex = Math.min(state.reviewIndex, Math.max(0, state.reviewOrder.length - 1));
  }

  function resetAnswerState() {
    state.resultVisible = false;
    state.lastUserAnswer = "";
    state.lastScore = null;
    state.editingAnswer = false;
  }

  function nextQuestion() {
    saveCurrentDraft();
    resetAnswerState();
    if (state.mode === "study") {
      const key = keyForCurrentFilter();
      state.studyIndexByFilter[key] = (state.studyIndexByFilter[key] || 0) + 1;
    } else if (state.wrongIds.length) {
      state.reviewIndex += 1;
      ensureReviewOrder();
    }
    saveState();
    render();
  }

  function previousQuestion() {
    saveCurrentDraft();
    resetAnswerState();
    if (state.mode === "study") {
      const key = keyForCurrentFilter();
      state.studyIndexByFilter[key] = Math.max(0, (state.studyIndexByFilter[key] || 0) - 1);
    } else if (state.wrongIds.length) {
      state.reviewIndex = Math.max(0, state.reviewIndex - 1);
    }
    saveState();
    render();
  }

  function skipQuestion() {
    nextQuestion();
  }

  function submitCurrentAnswer() {
    const question = currentQuestion();
    if (!question) return;
    const userAnswer = el.answerInput.value.trim();
    const score = scoreAnswer(userAnswer, effectiveAnswer(question), question.question);
    state.lastUserAnswer = userAnswer;
    state.lastScore = score;
    state.resultVisible = true;
    delete state.drafts[question.uid];
    recordTiming(question, score);
    if (score < 80) addWrong(question);
    saveState();
    render();
  }

  function showSelfCheckAnswer(markWrong) {
    const question = currentQuestion();
    if (!question) return;
    if (markWrong) addWrong(question);
    if (usesDraft(question)) {
      state.lastUserAnswer = el.answerInput.value;
      state.drafts[question.uid] = el.answerInput.value;
    }
    state.resultVisible = true;
    if (!usesDraft(question)) {
      state.lastUserAnswer = "";
    }
    state.lastScore = null;
    recordTiming(question, markWrong ? 60 : 100);
    saveState();
    render();
  }

  function usesSelfCheck(question) {
    return question && (question.deck === "专业英语翻译" || question.deck === "英文翻译");
  }

  function usesDraft(question) {
    return question && question.deck === "英文翻译";
  }

  function normalizeForScore(value) {
    return String(value)
      .toLowerCase()
      .replace(/[，。！？；：、,.!?;:()[\]{}"'“”‘’_—\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function compactForScore(value) {
    return normalizeForScore(value).replace(/\s/g, "");
  }

  function cjkBigrams(value) {
    const tokens = [];
    const runs = value.match(/[\u4e00-\u9fff]+/g) || [];
    for (const run of runs) {
      if (run.length === 1) {
        tokens.push(run);
      } else {
        for (let i = 0; i < run.length - 1; i += 1) tokens.push(run.slice(i, i + 2));
      }
    }
    return tokens;
  }

  function scoreTokens(value) {
    const normalized = normalizeForScore(value);
    const english = normalized.match(/[a-z0-9]+/g) || [];
    return [...english, ...cjkBigrams(normalized)].filter((item) => item.length > 0);
  }

  function tokenCounts(tokens) {
    const counts = new Map();
    tokens.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
    return counts;
  }

  function overlapCount(aTokens, bTokens) {
    const a = tokenCounts(aTokens);
    const b = tokenCounts(bTokens);
    let total = 0;
    a.forEach((count, token) => {
      total += Math.min(count, b.get(token) || 0);
    });
    return total;
  }

  function lcsRatio(a, b) {
    const left = compactForScore(a);
    const right = compactForScore(b);
    if (!left || !right) return 0;
    const prev = new Array(right.length + 1).fill(0);
    const curr = new Array(right.length + 1).fill(0);
    for (let i = 1; i <= left.length; i += 1) {
      for (let j = 1; j <= right.length; j += 1) {
        curr[j] = left[i - 1] === right[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1]);
      }
      for (let j = 0; j <= right.length; j += 1) prev[j] = curr[j];
    }
    return prev[right.length] / Math.max(left.length, right.length);
  }

  function canonicalConcept(value) {
    return normalizeRuleText(value);
  }

  function cleanConceptLabel(value) {
    return String(value)
      .replace(/^[\s(（【\[]*[0-9一二三四五六七八九十]+[\s、.)）】\]]*/g, "")
      .replace(/^(答|解析|包括|分为|有)/g, "")
      .replace(/[^\u4e00-\u9fffA-Za-z0-9-]/g, "")
      .trim();
  }

  const ACRONYM_ALIASES = {
    CAD: ["计算机辅助设计", "computer aided design", "computer-aided design"],
    CAM: ["计算机辅助制造", "computer aided manufacturing", "computer-aided manufacturing"],
    CAPP: ["计算机辅助工艺设计", "computer aided process planning", "computer-aided process planning"],
    PLC: ["可编程逻辑控制器", "programmable logic controller"],
    FMS: ["柔性制造系统", "flexible manufacturing system"],
    CNC: ["计算机数字控制", "计算机数控", "computer numerical control"],
    CAE: ["计算机辅助工程", "computer aided engineering", "computer-aided engineering"],
    CIMS: ["计算机集成制造系统", "computer integrated manufacturing system"],
    AGV: ["自动导引车", "automated guided vehicle", "automatic guided vehicle"],
  };

  const TERM_ALIASES = [
    ["交变载荷", ["重复载荷", "循环载荷", "alternating load", "repeated load"]],
    ["减小摩擦", ["减少摩擦", "降低摩擦", "减摩"]],
    ["减少磨损", ["降低磨损", "减小磨损"]],
    ["降低温升", ["降低温度", "减少发热", "散热"]],
    ["提高可靠性", ["增强可靠性", "保证可靠性"]],
    ["提高寿命", ["延长寿命", "提高使用寿命", "延长使用寿命"]],
    ["无反馈", ["没有反馈", "无反馈环节", "不需要反馈"]],
    ["有反馈", ["具有反馈", "反馈控制", "闭环反馈"]],
    ["结构简单", ["结构较简单", "系统简单"]],
    ["精度高", ["控制精度高", "准确性高"]],
    ["抗干扰", ["抗扰动", "抗干扰能力强"]],
    ["螺纹连接", ["螺栓连接", "螺钉连接"]],
    ["键连接", ["平键连接", "花键连接"]],
    ["销连接", ["圆柱销连接", "圆锥销连接"]],
    ["焊接", ["焊接连接"]],
    ["铆接", ["铆钉连接"]],
    ["胶接", ["粘接", "胶粘连接"]],
    ["过盈连接", ["过盈配合连接"]],
  ];

  function toHalfWidth(value) {
    return String(value).replace(/[\uFF01-\uFF5E]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0)).replace(/\u3000/g, " ");
  }

  function normalizeRuleText(value) {
    let text = toHalfWidth(value)
      .toLowerCase()
      .replace(/computer[\s-]*aided/g, "computeraided")
      .replace(/各项同性/g, "各向同性")
      .replace(/计算机\s*辅助/g, "计算机辅助")
      .replace(/可\s*编程/g, "可编程")
      .replace(/[，。！？；：、,.!?;:()[\]{}"'“”‘’_—\-\/]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    text = text.replace(/(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, "");
    return text.replace(/\s/g, "");
  }

  function inferQuestionType(questionText, standardAnswer) {
    const question = String(questionText || "");
    const answer = String(standardAnswer || "");
    if (extractAcronyms(`${question} ${answer}`).length) return "acronym";
    if (/区别|差异|不同|比较|对比/.test(question)) return "comparison";
    if (/为什么|为何|原因|作用|意义|目的|优点|好处/.test(question)) return "reason";
    if (/哪些|有哪|列举|举出|几种|几类|分类|形式|方式|组成|包括/.test(question)) return "list";
    if (/什么是|何谓|定义|含义|概念|是什么/.test(question)) return "definition";
    return "general";
  }

  function extractAcronyms(value) {
    return Array.from(new Set((String(value).match(/[A-Z]{2,}/g) || []).map((item) => item.toUpperCase())));
  }

  function extractConceptPoints(answer, questionText = "") {
    return buildRulePoints(questionText, answer).map((point) => point.key);
  }

  function buildRulePoints(questionText, standardAnswer) {
    const type = inferQuestionType(questionText, standardAnswer);
    const acronymPoints = extractAcronymDefinitionPoints(standardAnswer, questionText);
    if (type === "acronym" && acronymPoints.length) return acronymPoints;
    const segments = extractAnswerSegments(standardAnswer, type);
    return dedupePoints(segments.map((segment) => buildPoint(segment, type)).filter(Boolean));
  }

  function extractAcronymDefinitionPoints(text, questionText = "") {
    const points = [];
    const acronyms = extractAcronyms(`${questionText} ${text}`);
    const matches = Array.from(String(text).matchAll(/[A-Z]{2,}/g));
    const matched = new Set();
    for (let index = 0; index < matches.length; index += 1) {
      const acronym = matches[index][0].toUpperCase();
      const start = matches[index].index + acronym.length;
      const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
      const definition = text.slice(start, end).replace(/^[\s:：;；、，,.。]+/, "").replace(/[\s:：;；、，,.。]+$/g, "");
      const aliases = Array.from(new Set([...(ACRONYM_ALIASES[acronym] || []), definition, `${acronym}${definition}`].filter(Boolean)));
      const display = `${acronym}${definition ? ` ${definition}` : aliases[1] ? ` ${aliases[1]}` : ""}`;
      points.push({ key: canonicalConcept(display), label: display, aliases, weight: 1, type: "acronym", acronym });
      matched.add(acronym);
    }
    acronyms.forEach((acronym) => {
      if (matched.has(acronym) || !ACRONYM_ALIASES[acronym]) return;
      const display = `${acronym} ${ACRONYM_ALIASES[acronym][0]}`;
      points.push({ key: canonicalConcept(display), label: display, aliases: ACRONYM_ALIASES[acronym], weight: 1, type: "acronym", acronym });
    });
    return dedupePoints(points);
  }

  function extractAnswerSegments(answer, type) {
    let text = String(answer || "").replace(/答[:：]?|解析[:：]?/g, " ").replace(/\s+/g, " ").trim();
    text = text.replace(/(?:^|\s)[(（]?[0-9一二三四五六七八九十]+[)）]?[、.]/g, "；");
    const colonPoints = [];
    Array.from(text.matchAll(/([^；;。.!?\n]{1,18})[:：]\s*([^；;。.!?\n]+)/g)).forEach((match) => {
      const left = cleanConceptLabel(match[1]);
      const right = cleanSegment(match[2]);
      if (left && right) colonPoints.push(`${left} ${right}`);
    });
    if (colonPoints.length >= 2) return colonPoints;
    return Array.from(
      new Set(
        text
          .split(/[；;。.!?\n]/)
          .flatMap((chunk) => splitListChunk(chunk, type))
          .map(cleanSegment)
          .filter(isUsefulSegment)
      )
    ).slice(0, 12);
  }

  function splitListChunk(chunk, type) {
    const value = String(chunk).replace(/主要|通常|一般|可以|能够|需要|应|应当|常用|常见|包括|分为|有|有以下|如下|例如/g, " ").trim();
    if (["list", "reason", "comparison"].includes(type)) return value.split(/、|，|,|以及|并且|并|和|与/);
    return [value];
  }

  function cleanSegment(value) {
    return cleanConceptLabel(value).replace(/^(其|它|这|该|可|能|是|为|把|将)/g, "").replace(/等$/g, "").trim();
  }

  function isUsefulSegment(value) {
    const compact = canonicalConcept(value);
    return compact.length >= 2 && compact.length <= 40 && !/^(的|和|与|及|或|在|中|时)$/.test(compact);
  }

  function buildPoint(segment, type) {
    const key = canonicalConcept(segment);
    if (!key) return null;
    return { key, label: segment, aliases: aliasesForSegment(segment), weight: 1, type };
  }

  function aliasesForSegment(segment) {
    const aliases = new Set([segment]);
    const norm = canonicalConcept(segment);
    TERM_ALIASES.forEach(([term, values]) => {
      const all = [term, ...values];
      if (all.some((item) => norm.includes(canonicalConcept(item)))) all.forEach((item) => aliases.add(item));
    });
    Object.entries(ACRONYM_ALIASES).forEach(([acronym, values]) => {
      if ([acronym, ...values].some((item) => norm.includes(canonicalConcept(item)))) {
        aliases.add(acronym);
        values.forEach((item) => aliases.add(item));
      }
    });
    return Array.from(aliases);
  }

  function dedupePoints(points) {
    const seen = new Set();
    return points.filter((point) => {
      if (!point || seen.has(point.key)) return false;
      seen.add(point.key);
      return true;
    });
  }

  function conceptCoverageScore(userAnswer, standardAnswer, questionText = "") {
    const points = buildRulePoints(questionText, standardAnswer);
    if (!points.length) return null;
    const type = inferQuestionType(questionText, standardAnswer);
    const user = normalizeRuleText(userAnswer);
    let earned = 0;
    let total = 0;
    const hit = [];
    points.forEach((point) => {
      const pointScore = pointMatchScore(user, point);
      total += point.weight || 1;
      earned += (point.weight || 1) * pointScore;
      if (pointScore >= 0.75) hit.push(point.key);
    });
    const coverage = total ? (earned / total) * 100 : 0;
    const score =
      type === "acronym"
        ? coverage
        : Math.min(100, coverage * 0.8 + expressionScore(userAnswer, points) + structureScore(userAnswer, type, points) - wrongConceptPenalty(user, points));
    return {
      points: points.map((point) => point.key),
      hit,
      score: Math.max(0, Math.round(score)),
      type,
    };
  }

  function pointMatchScore(user, point) {
    const bestAlias = Math.max(0, ...point.aliases.map((alias) => aliasMatchScore(user, alias)));
    if (point.type === "acronym" && point.acronym && user.includes(point.acronym.toLowerCase())) {
      return Math.max(bestAlias, bestAlias >= 0.75 ? 1 : 0.35);
    }
    return bestAlias;
  }

  function aliasMatchScore(user, alias) {
    const norm = normalizeRuleText(alias);
    if (!norm || norm.length < 2) return 0;
    if (user.includes(norm)) return 1;
    const relaxed = norm.replace(/[性度]$/g, "");
    if (relaxed.length >= 2 && user.includes(relaxed)) return 0.92;
    if (/^[\u4e00-\u9fff]+$/.test(norm) && norm.length >= 4) {
      const overlap = cjkOverlapRatio(user, norm);
      if (overlap >= 0.85) return 0.82;
      if (overlap >= 0.7) return 0.65;
    }
    return 0;
  }

  function cjkOverlapRatio(user, norm) {
    const grams = [];
    for (let i = 0; i < norm.length - 1; i += 1) grams.push(norm.slice(i, i + 2));
    if (!grams.length) return 0;
    return grams.filter((gram) => user.includes(gram)).length / grams.length;
  }

  function expressionScore(userAnswer, points) {
    const answer = String(userAnswer || "");
    if (!answer.trim()) return 0;
    const termHits = points.filter((point) => pointMatchScore(normalizeRuleText(answer), point) >= 0.75).length;
    if (!termHits) return 0;
    return Math.min(10, 4 + termHits * 2);
  }

  function structureScore(userAnswer, type, points) {
    const answer = String(userAnswer || "");
    if (points.length <= 1) return 10;
    if (/[;；、\n]|[(（]?[0-9一二三四五六七八九十]+[)）]?[、.]/.test(answer)) return 10;
    if (type === "comparison" && /开环|闭环|滚动|滑动|低碳钢|铸铁|前者|后者/.test(answer)) return 8;
    if (type === "definition") return 6;
    return 3;
  }

  function wrongConceptPenalty(user, points) {
    let penalty = 0;
    if (user.includes("各向异性") && points.some((point) => point.key.includes("各向同性"))) penalty += 20;
    if (user.includes("无反馈") && points.some((point) => point.key.includes("有反馈"))) penalty += 10;
    if (user.includes("有反馈") && points.some((point) => point.key.includes("无反馈"))) penalty += 10;
    return penalty;
  }

  function displayConcept(point) {
    return String(point)
      .replace(/^([a-z]{2,})([\u4e00-\u9fff])/, (_, acronym, text) => `${acronym.toUpperCase()} ${text}`)
      .replace(/([A-Za-z])([A-Z])/g, "$1 $2")
      .trim();
  }

  function renderConceptBox(question) {
    const concept = conceptCoverageScore(state.lastUserAnswer, effectiveAnswer(question), question?.question || "");
    if (!concept || !concept.points.length) {
      el.conceptBox.classList.add("hidden");
      return;
    }
    const hitSet = new Set(concept.hit);
    const missed = concept.points.filter((point) => !hitSet.has(point));
    el.hitConcepts.innerHTML = concept.hit.length
      ? concept.hit.map((point) => `<span class="concept-chip hit">${escapeHtml(displayConcept(point))}</span>`).join("")
      : `<span class="concept-empty">暂无</span>`;
    el.missConcepts.innerHTML = missed.length
      ? missed.map((point) => `<span class="concept-chip miss">${escapeHtml(displayConcept(point))}</span>`).join("")
      : `<span class="concept-empty">暂无</span>`;
    el.conceptBox.classList.remove("hidden");
  }

  function questionByUid(uid) {
    return questions.find((item) => item.uid === uid) || null;
  }

  function randomSample(list, count) {
    return shuffle(list).slice(0, count);
  }

  function professionalMockGroups() {
    return unique(studyQuestions.filter((item) => item.deck === "专业知识问答").map((item) => item.group)).sort((a, b) =>
      a.localeCompare(b, "zh-Hans-CN")
    );
  }

  function validMockGroups() {
    const groups = professionalMockGroups();
    state.mockGroups = Array.isArray(state.mockGroups) ? state.mockGroups.filter((group) => groups.includes(group)) : [];
    return groups;
  }

  function showMockRangeNotice(message, danger = true) {
    if (!el.mockRangeNotice) return;
    el.mockRangeNotice.textContent = message;
    el.mockRangeNotice.classList.toggle("danger", danger);
    el.mockRangeNotice.classList.remove("hidden");
  }

  function renderMockGroupSelector() {
    if (!el.mockGroupList) return;
    const groups = validMockGroups();
    const selected = new Set(state.mockGroups);
    el.mockGroupList.innerHTML = groups
      .map(
        (group) => `<label class="check-item">
          <input type="checkbox" value="${escapeHtml(group)}" ${selected.has(group) ? "checked" : ""}>
          <span>${escapeHtml(group)}</span>
        </label>`
      )
      .join("");
    if (el.mockRangeNotice) {
      el.mockRangeNotice.textContent = "";
      el.mockRangeNotice.classList.add("hidden");
    }
  }

  function saveMockGroupSelection() {
    const checked = Array.from(el.mockGroupList.querySelectorAll("input[type='checkbox']:checked")).map((input) => input.value);
    state.mockGroups = checked;
    state.mockGroupsInitialized = true;
    saveState();
    if (checked.length) el.mockRangeNotice.classList.add("hidden");
  }

  function startMock() {
    const groups = validMockGroups();
    const selectedGroups = state.mockGroups.filter((group) => groups.includes(group));
    if (!selectedGroups.length) {
      showMockRangeNotice("请至少勾选一个专业题大类，再开始模拟面试。");
      return;
    }

    const professionalPool = studyQuestions.filter((item) => item.deck === "专业知识问答" && selectedGroups.includes(item.group));
    if (!professionalPool.length) {
      showMockRangeNotice("当前勾选范围内没有可用的专业题。");
      return;
    }

    const professional = randomSample(professionalPool, Math.min(3, professionalPool.length));
    const translations = randomSample(studyQuestions.filter((item) => item.deck === "英文翻译"), 2);
    const items = shuffle([...professional, ...translations]).map((item) => item.uid);
    state.mock = {
      items,
      index: 0,
      answers: {},
      startedAt: Date.now(),
      limitMs: 10 * 60 * 1000,
      finishedAt: null,
      report: null,
    };
    saveState();
    startMockTimer();
    render();
  }

  function mockCurrentQuestion() {
    if (!state.mock || !state.mock.items.length) return null;
    return questionByUid(state.mock.items[state.mock.index]);
  }

  function saveMockAnswer() {
    const question = mockCurrentQuestion();
    if (!question || !state.mock) return;
    state.mock.answers[question.uid] = el.mockAnswerInput.value;
    saveState();
  }

  function moveMock(delta) {
    saveMockAnswer();
    if (!state.mock) return;
    state.mock.index = Math.max(0, Math.min(state.mock.items.length - 1, state.mock.index + delta));
    saveState();
    renderMock();
  }

  function finishMock() {
    saveMockAnswer();
    if (!state.mock) return;
    const results = state.mock.items.map((uid) => {
      const question = questionByUid(uid);
      const answer = state.mock.answers[uid] || "";
      const score = question ? scoreAnswer(answer, effectiveAnswer(question), question.question) : 0;
      return {
        uid,
        score,
        answer,
        subject: question?.subject || "未分类",
        group: question?.group || "未分类",
        deck: question?.deck || "题库",
        autoWrong: false,
      };
    });
    const average = Math.round(results.reduce((sum, item) => sum + item.score, 0) / Math.max(1, results.length));
    const weak = weakestBuckets(results);
    state.mock.finishedAt = Date.now();
    state.mock.report = { results, average, weak };
    state.mockHistory.unshift({
      at: state.mock.finishedAt,
      average,
      weak,
      results,
    });
    state.mockHistory = state.mockHistory.slice(0, 20);
    saveState();
    stopMockTimer();
    renderMock();
  }

  function weakestBuckets(results) {
    const buckets = new Map();
    results.forEach((item) => {
      const key = `${item.deck} / ${item.subject}`;
      const bucket = buckets.get(key) || { key, total: 0, count: 0 };
      bucket.total += item.score;
      bucket.count += 1;
      buckets.set(key, bucket);
    });
    return Array.from(buckets.values())
      .map((item) => ({ key: item.key, average: Math.round(item.total / item.count), count: item.count }))
      .sort((a, b) => a.average - b.average)
      .slice(0, 3);
  }

  function mockTimeLeft() {
    if (!state.mock) return 10 * 60 * 1000;
    return Math.max(0, state.mock.limitMs - (Date.now() - state.mock.startedAt));
  }

  function startMockTimer() {
    stopMockTimer();
    mockTimerId = setInterval(() => {
      if (state.mode !== "mock" || !state.mock || state.mock.report) {
        stopMockTimer();
        return;
      }
      if (mockTimeLeft() <= 0) {
        finishMock();
        return;
      }
      updateMockTimer();
    }, 1000);
  }

  function stopMockTimer() {
    if (mockTimerId) clearInterval(mockTimerId);
    mockTimerId = null;
  }

  function updateMockTimer() {
    const left = mockTimeLeft();
    const seconds = Math.ceil(left / 1000);
    el.mockTimer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    el.mockTimer.classList.toggle("danger", left <= 60 * 1000);
  }

  function renderMock() {
    el.mockArea.classList.remove("hidden");
    el.mockIntro.classList.toggle("hidden", !!state.mock);
    el.mockQuestionPanel.classList.add("hidden");
    el.mockReport.classList.add("hidden");
    updateMockTimer();

    if (!state.mock) {
      stopMockTimer();
      el.mockTitle.textContent = "随机抽题，限时作答";
      renderMockGroupSelector();
      return;
    }

    if (state.mock.report) {
      stopMockTimer();
      renderMockReport();
      return;
    }

    startMockTimer();
    const question = mockCurrentQuestion();
    if (!question) return;
    el.mockTitle.textContent = `第 ${state.mock.index + 1} / ${state.mock.items.length} 题`;
    el.mockQuestionPanel.classList.remove("hidden");
    el.mockSource.textContent = `${question.deck} · ${question.subject} · ${question.chapter || "未分章节"}`;
    el.mockQuestionText.textContent = question.question;
    el.mockAnswerInput.value = state.mock.answers[question.uid] || "";
    el.mockPrevBtn.disabled = state.mock.index === 0;
    el.mockNextBtn.textContent = state.mock.index >= state.mock.items.length - 1 ? "保存" : "保存并下一题";
  }

  function renderMockReport() {
    const report = state.mock.report;
    el.mockTitle.textContent = "本轮面试报告";
    el.mockReport.classList.remove("hidden");
    const rows = report.results
      .map((item, index) => {
        const question = questionByUid(item.uid);
        const inWrong = question && state.wrongIds.includes(question.uid);
        const questionHtml = question?.alignment?.length
          ? renderAligned(question.question, "left", question)
          : escapeHtml(question?.question || "题目");
        const answerHtml = question?.alignment?.length
          ? renderAligned(effectiveAnswer(question), "right", question)
          : escapeHtml(effectiveAnswer(question)).replace(/\n/g, "<br>");
        return `<div class="report-item" data-uid="${escapeHtml(item.uid)}">
          <strong>${index + 1}. <span class="translation-text">${questionHtml}</span></strong>
          <span>${item.score} 分 · ${escapeHtml(item.deck)} · ${escapeHtml(item.subject)}</span>
          <button class="ghost compact mock-wrong-toggle ${inWrong ? "active-tool" : ""}" data-uid="${escapeHtml(item.uid)}" type="button">
            ${inWrong ? "已加入错题本" : "加入错题本"}
          </button>
          <details><summary>查看标准答案</summary><p class="translation-text">${answerHtml}</p></details>
        </div>`;
      })
      .join("");
    const weak = report.weak.length
      ? report.weak.map((item) => `<span class="concept-chip miss">${escapeHtml(item.key)}：${item.average} 分</span>`).join("")
      : `<span class="concept-empty">本轮没有明显弱项</span>`;
    el.mockReport.innerHTML = `
      <div class="report-score">${report.average}<small>平均分</small></div>
      <div class="concept-box"><p>本轮弱项</p><div>${weak}</div></div>
      ${rows}
      <div class="actions"><button class="primary" id="restartMockBtn" type="button">再来一轮</button></div>
    `;
    document.getElementById("restartMockBtn").addEventListener("click", () => {
      state.mock = null;
      saveState();
      startMock();
    });
    document.querySelectorAll(".mock-wrong-toggle").forEach((button) => {
      button.addEventListener("click", () => toggleMockWrong(button.dataset.uid));
    });
  }

  function toggleMockWrong(uid) {
    const question = questionByUid(uid);
    if (!question) return;
    if (state.wrongIds.includes(question.uid)) {
      removeWrong(question);
    } else {
      addWrong(question);
    }
    saveState();
    renderStats();
    renderMockReport();
  }

  function renderAnalysis() {
    el.analysisArea.classList.remove("hidden");
    const wrongSet = new Set(state.wrongIds);
    const attempted = Object.entries(state.timing)
      .map(([uid, item]) => ({ question: questionByUid(uid), timing: item }))
      .filter((item) => item.question);
    const weakGroups = rankBuckets(questions.filter((item) => wrongSet.has(item.uid)), "group");
    const weakSubjects = rankBuckets(questions.filter((item) => wrongSet.has(item.uid)), "subject");
    const slowSubjects = rankSlowBuckets(attempted, "subject");
    const mockWeak = state.mockHistory.flatMap((item) => item.weak || []);

    const groupHtml = renderRankList(weakGroups, "目前错题较集中的大类", "暂无明显大类弱项");
    const subjectHtml = renderRankList(weakSubjects, "需要优先复习的专题", "暂无明显专题弱项");
    const slowHtml = renderSlowList(slowSubjects, "反应较慢的专题", "暂无足够计时数据");
    const mockHtml = mockWeak.length
      ? `<div class="analysis-card"><h3>模拟面试暴露的问题</h3>${mockWeak
          .slice(0, 6)
          .map((item) => `<span class="concept-chip miss">${escapeHtml(item.key)}：${item.average} 分</span>`)
          .join("")}</div>`
      : "";

    el.analysisContent.innerHTML = `
      <div class="analysis-grid">
        ${groupHtml}
        ${subjectHtml}
        ${slowHtml}
        ${mockHtml || `<div class="analysis-card"><h3>模拟面试</h3><p>完成一轮模拟面试后，这里会显示面试维度的弱项。</p></div>`}
      </div>
    `;
  }

  function rankBuckets(list, key) {
    const buckets = new Map();
    list.forEach((item) => {
      const name = item[key] || "未分类";
      buckets.set(name, (buckets.get(name) || 0) + 1);
    });
    return Array.from(buckets.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  function rankSlowBuckets(items, key) {
    const buckets = new Map();
    items.forEach(({ question, timing }) => {
      const name = question[key] || "未分类";
      const bucket = buckets.get(name) || { name, count: 0, total: 0 };
      bucket.count += timing.attempts || 0;
      bucket.total += timing.totalAnswerMs || 0;
      buckets.set(name, bucket);
    });
    return Array.from(buckets.values())
      .filter((item) => item.count > 0)
      .map((item) => ({ name: item.name, count: item.count, averageMs: Math.round(item.total / item.count) }))
      .sort((a, b) => b.averageMs - a.averageMs)
      .slice(0, 6);
  }

  function renderRankList(items, title, emptyText) {
    if (!items.length) return `<div class="analysis-card"><h3>${title}</h3><p>${emptyText}</p></div>`;
    return `<div class="analysis-card"><h3>${title}</h3>${items
      .map((item) => `<div class="analysis-row"><span>${escapeHtml(item.name)}</span><strong>${item.count} 题</strong></div>`)
      .join("")}</div>`;
  }

  function renderSlowList(items, title, emptyText) {
    if (!items.length) return `<div class="analysis-card"><h3>${title}</h3><p>${emptyText}</p></div>`;
    return `<div class="analysis-card"><h3>${title}</h3>${items
      .map((item) => `<div class="analysis-row"><span>${escapeHtml(item.name)}</span><strong>${formatDuration(item.averageMs)}</strong></div>`)
      .join("")}</div>`;
  }

  function renderData() {
    el.dataArea.classList.remove("hidden");
  }

  function exportJson(filename, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function questionSnapshot(uid) {
    const question = questionByUid(uid);
    if (!question) return { uid };
    return {
      uid,
      deck: question.deck,
      group: question.group,
      subject: question.subject,
      chapter: question.chapter,
      sourceFile: question.sourceFile,
      sourceNumber: question.sourceNumber,
      question: question.question,
      answer: effectiveAnswer(question),
    };
  }

  function exportAllData() {
    saveCurrentDraft();
    exportJson(`mechanical-trainer-backup-${dateStamp()}.json`, {
      type: "mechanical-trainer-full-backup",
      exportedAt: new Date().toISOString(),
      currentUser,
      profileStore,
    });
  }

  function exportWrongData() {
    exportJson(`错题本-${currentUser}-${dateStamp()}.json`, {
      type: "mechanical-trainer-wrong-book",
      exportedAt: new Date().toISOString(),
      currentUser,
      items: state.wrongIds.map(questionSnapshot),
    });
  }

  function exportFavoriteData() {
    exportJson(`收藏题-${currentUser}-${dateStamp()}.json`, {
      type: "mechanical-trainer-favorites",
      exportedAt: new Date().toISOString(),
      currentUser,
      items: state.favoriteIds.map(questionSnapshot),
    });
  }

  function exportEditData() {
    exportJson(`修订答案-${currentUser}-${dateStamp()}.json`, {
      type: "mechanical-trainer-answer-overrides",
      exportedAt: new Date().toISOString(),
      currentUser,
      answerOverrides: state.answerOverrides,
      items: Object.keys(state.answerOverrides || {}).map(questionSnapshot),
    });
  }

  function exportReviewData() {
    exportJson(`复习记录-${currentUser}-${dateStamp()}.json`, {
      type: "mechanical-trainer-review-records",
      exportedAt: new Date().toISOString(),
      currentUser,
      timing: state.timing,
      mockHistory: state.mockHistory,
    });
  }

  function dateStamp() {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || ""));
        if (payload.type !== "mechanical-trainer-full-backup" || !payload.profileStore?.profiles) {
          showDataNotice("只能导入“一键备份全部数据”生成的完整备份。", true);
          return;
        }
        profileStore = payload.profileStore;
        currentUser = payload.currentUser || profileStore.currentUser || Object.keys(profileStore.profiles)[0];
        profileStore.currentUser = currentUser;
        state = loadState();
        normalizeState();
        persistProfileStore();
        showDataNotice("已恢复备份数据。", false);
        render();
      } catch {
        showDataNotice("导入失败，文件不是有效备份。", true);
      }
    };
    reader.readAsText(file, "utf-8");
  }

  function showDataNotice(message, danger) {
    el.dataNotice.textContent = message;
    el.dataNotice.classList.toggle("danger", !!danger);
    el.dataNotice.classList.remove("hidden");
  }

  function scoreAnswer(userAnswer, standardAnswer, questionText = "") {
    const user = normalizeForScore(userAnswer);
    const standard = normalizeForScore(standardAnswer);
    if (!user) return 0;
    if (user === standard) return 100;

    const concept = conceptCoverageScore(userAnswer, standardAnswer, questionText);
    if (concept) {
      const coverage = concept.score;
      const textBackup = textSimilarityScore(userAnswer, standardAnswer);
      return Math.max(coverage, Math.round(coverage * 0.85 + textBackup * 0.15));
    }

    return textSimilarityScore(userAnswer, standardAnswer);
  }

  function textSimilarityScore(userAnswer, standardAnswer) {
    const user = normalizeForScore(userAnswer);
    const standard = normalizeForScore(standardAnswer);
    if (!user) return 0;
    if (user === standard) return 100;
    if (standard.includes(user) || user.includes(standard)) {
      const ratio = Math.min(user.length, standard.length) / Math.max(user.length, standard.length);
      if (ratio >= 0.55) return Math.max(82, Math.round(100 * ratio));
    }

    const userTokens = scoreTokens(userAnswer);
    const standardTokens = scoreTokens(standardAnswer);
    if (!standardTokens.length) return 0;
    const overlap = overlapCount(userTokens, standardTokens);
    const recall = overlap / standardTokens.length;
    const precision = userTokens.length ? overlap / userTokens.length : 0;
    const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
    const sequence = lcsRatio(userAnswer, standardAnswer);
    const score = Math.round(100 * (0.5 * recall + 0.35 * f1 + 0.15 * sequence));
    return Math.max(0, Math.min(100, score));
  }

  function scoreBand(score) {
    if (score >= 80) {
      return {
        label: "掌握还可以",
        className: "good",
        explain: "80 分及以上：你的答案和标准答案匹配度较高，本题不进入错题本。",
      };
    }
    if (score >= 60) {
      return {
        label: "大概知道但很模糊",
        className: "middle",
        explain: "60-79 分：你抓到了一部分知识点，但表达或关键点仍有缺口，已加入错题本。",
      };
    }
    return {
      label: "几乎不了解",
      className: "low",
      explain: "60 分以下：和标准答案差距较大，已加入错题本。",
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function findVocabularyQuestion(english, chinese) {
    const key = syntheticWordKey(english, chinese);
    return (
      translationQuestions.find((item) => {
        const direct = syntheticWordKey(item.answer, item.question);
        const reverse = syntheticWordKey(item.question, item.answer);
        return direct === key || reverse === key;
      }) ||
      syntheticWordQuestions.find((item) => syntheticWordKey(item.question, item.answer) === key) ||
      null
    );
  }

  function addAlignmentWordToWrong(pairIndex, sourceQuestion = null) {
    const question = sourceQuestion || currentQuestion();
    if (!question || question.deck !== "英文翻译") return;
    const pair = question.alignment && question.alignment[Number(pairIndex)];
    if (!pair) return;

    const english = question.translationDirection === "中译英" ? pair.right : pair.left;
    const chinese = question.translationDirection === "中译英" ? pair.left : pair.right;
    const vocabularyQuestion = findVocabularyQuestion(english, chinese);
    if (!vocabularyQuestion) return;

    const alreadyWrong = state.wrongIds.includes(vocabularyQuestion.uid);
    addWrong(vocabularyQuestion);
    saveState();
    renderStats();
    return {
      english,
      chinese,
      alreadyWrong,
      message: alreadyWrong ? `“${english}” 已经在英语词汇错题本里。` : `已加入英语词汇错题本：${english} = ${chinese}`,
    };
  }

  function showInlineNotice(container, message) {
    if (!container) {
      showWordNotice(message);
      return;
    }
    let notice = container.querySelector(".inline-word-notice");
    if (!notice) {
      notice = document.createElement("p");
      notice.className = "inline-word-notice";
      container.appendChild(notice);
    }
    notice.textContent = message;
    notice.classList.remove("hidden");
    clearTimeout(notice.hideTimer);
    notice.hideTimer = setTimeout(() => notice.classList.add("hidden"), 2200);
  }

  function showWordNotice(message) {
    el.wordNotice.textContent = message;
    el.wordNotice.classList.remove("hidden");
    clearTimeout(showWordNotice.timer);
    showWordNotice.timer = setTimeout(() => {
      el.wordNotice.classList.add("hidden");
    }, 2200);
  }

  function renderAligned(value, side, question) {
    if (!question.alignment || !question.alignment.length) return escapeHtml(value);
    const source = String(value);
    const terms = question.alignment
      .map((item, index) => ({ text: item[side] || "", index }))
      .filter((item) => item.text)
      .sort((a, b) => b.text.length - a.text.length);
    if (!terms.length) return escapeHtml(value);

    let html = "";
    let cursor = 0;
    while (cursor < source.length) {
      const found = terms.find((item) => {
        const slice = source.slice(cursor, cursor + item.text.length);
        if (slice.toLowerCase() !== item.text.toLowerCase()) return false;
        if (!/[A-Za-z0-9-]/.test(item.text)) return true;
        const before = source[cursor - 1] || "";
        const after = source[cursor + item.text.length] || "";
        return !/[A-Za-z0-9-]/.test(before) && !/[A-Za-z0-9-]/.test(after);
      });
      if (!found) {
        html += escapeHtml(source[cursor]);
        cursor += 1;
        continue;
      }

      const original = source.slice(cursor, cursor + found.text.length);
      const clickable = question.deck === "英文翻译" ? " clickable-token" : "";
      const title = question.deck === "英文翻译" ? ' title="点击加入英语词汇错题本"' : "";
      html += `<span class="align-token${clickable} pair-${found.index}" data-pair="${found.index}" data-side="${side}"${title}>${escapeHtml(original)}</span>`;
      cursor += found.text.length;
    }
    return html;
  }

  function setQuestionText(question) {
    if (question.alignment && question.alignment.length) {
      el.questionText.classList.add("translation-text");
      el.questionText.innerHTML = renderAligned(question.question, "left", question);
    } else {
      el.questionText.classList.remove("translation-text");
      el.questionText.textContent = question.question;
    }
  }

  function setAnswerText(question) {
    const answer = effectiveAnswer(question);
    if (question.alignment && question.alignment.length) {
      el.answerText.classList.add("translation-text");
      el.answerText.innerHTML = renderAligned(answer, "right", question);
    } else {
      el.answerText.classList.remove("translation-text");
      el.answerText.textContent = answer;
    }
  }

  function setOptions(select, options, selectedValue) {
    select.innerHTML = options.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
    select.value = options.includes(selectedValue) ? selectedValue : options[0];
    return select.value;
  }

  function populateUsers() {
    const users = Object.keys(profileStore.profiles);
    el.userSelect.innerHTML = users.map((user) => `<option value="${escapeHtml(user)}">${escapeHtml(user)}</option>`).join("");
    el.userSelect.value = currentUser;
  }

  function populateFilters() {
    populateUsers();
    el.searchInput.value = state.search || "";
    state.deck = setOptions(el.deckFilter, optionsFor("deck", ALL_DECKS, studyQuestions), state.deck);
    state.file = setOptions(el.fileFilter, optionsFor("sourceFile", ALL_FILES, scopeForDeck()), state.file);
    state.group = setOptions(el.groupFilter, optionsFor("group", ALL_GROUPS, scopeForFile()), state.group);
    state.subject = setOptions(el.subjectFilter, optionsFor("subject", ALL_SUBJECTS, scopeForGroup()), state.subject);
    state.priority = setOptions(el.priorityFilter, optionsFor("priority", ALL_PRIORITIES, scopeForGroup()), state.priority);
    state.favoriteFilter = setOptions(el.favoriteFilter, [ALL_FAVORITES, FAVORITES_ONLY], state.favoriteFilter);
  }

  function renderEmpty(message) {
    el.questionText.classList.remove("translation-text");
    el.questionText.textContent = message;
    el.sourceLine.textContent = "";
    el.inputPanel.classList.add("hidden");
    el.scoreBox.classList.add("hidden");
    el.conceptBox.classList.add("hidden");
    el.answerBox.classList.add("hidden");
    el.answerEditor.classList.add("hidden");
    el.wordNotice.classList.add("hidden");
    el.favoriteBtn.classList.add("hidden");
    el.editAnswerBtn.classList.add("hidden");
    el.submitActions.classList.add("hidden");
    el.selfCheckActions.classList.add("hidden");
    el.nextActions.classList.add("hidden");
    el.groupLabel.textContent = state.group;
    el.subjectLabel.textContent = state.subject;
    el.priorityLabel.textContent = state.priority;
    el.numberLabel.textContent = "暂无题目";
  }

  function renderStats() {
    const list = filteredQuestions();
    const done = Math.min(state.studyIndexByFilter[keyForCurrentFilter()] || 0, list.length);
    el.totalCount.textContent = studyQuestions.length;
    el.wrongCount.textContent = state.wrongIds.length;
    el.progressCount.textContent = done;
    el.progressFill.style.width = list.length ? `${Math.round((done / list.length) * 100)}%` : "0%";
  }

  function canGoPrevious() {
    if (state.mode === "study") {
      return (state.studyIndexByFilter[keyForCurrentFilter()] || 0) > 0;
    }
    return state.reviewIndex > 0;
  }

  function setPracticeVisible(visible) {
    [el.questionMeta, el.questionCard, el.submitActions, el.selfCheckActions, el.nextActions].forEach((node) => {
      node.classList.toggle("hidden", !visible);
    });
    el.mockArea.classList.toggle("hidden", state.mode !== "mock");
    el.analysisArea.classList.toggle("hidden", state.mode !== "analysis");
    el.dataArea.classList.toggle("hidden", state.mode !== "data");
  }

  function render() {
    populateFilters();
    renderStats();

    el.studyTab.classList.toggle("active", state.mode === "study" && state.deck !== PREDICTION_DECK);
    el.predictionTab.classList.toggle("active", state.mode === "study" && state.deck === PREDICTION_DECK);
    el.reviewTab.classList.toggle("active", state.mode === "review");
    el.mockTab.classList.toggle("active", state.mode === "mock");
    el.analysisTab.classList.toggle("active", state.mode === "analysis");
    el.dataTab.classList.toggle("active", state.mode === "data");
    el.modeLabel.textContent = state.mode === "study" ? (state.deck === PREDICTION_DECK ? "押题模块" : "顺序刷题") : "错题复习";

    if (state.mode === "mock") {
      setPracticeVisible(false);
      renderMock();
      return;
    }
    if (state.mode === "analysis") {
      setPracticeVisible(false);
      renderAnalysis();
      return;
    }
    if (state.mode === "data") {
      setPracticeVisible(false);
      renderData();
      return;
    }
    setPracticeVisible(true);

    if (!questions.length) {
      renderEmpty("题库未载入，请先生成 questions.js。");
      return;
    }

    const question = currentQuestion();
    if (!question) {
      const message =
        state.mode === "study"
          ? "当前筛选范围已经刷完，可以切换分类或重置当前范围进度。"
          : "错题本还是空的，先在顺序刷题里答题，低于 80 分会自动加入错题本。";
      renderEmpty(message);
      return;
    }
    markQuestionView(question);

    const list = state.mode === "study" ? filteredQuestions() : state.wrongIds;
    const position =
      state.mode === "study"
        ? (state.studyIndexByFilter[keyForCurrentFilter()] || 0) + 1
        : state.reviewIndex + 1;

    el.groupLabel.textContent = question.group || "未分类";
    el.subjectLabel.textContent = question.subject || "未分类";
    el.priorityLabel.textContent = question.priority || "普通";
    el.numberLabel.textContent = `第 ${position} / ${list.length} 题`;
    const pageText = question.sourcePage ? ` · 第 ${question.sourcePage} 页` : "";
    const editedText = state.answerOverrides[question.uid] ? " · 已本地修订答案" : "";
    const avgAnswer = averageMs(question, "totalAnswerMs");
    const avgFirst = averageMs(question, "totalFirstInputMs");
    const timingText = avgAnswer == null ? "" : ` · 平均起笔 ${formatDuration(avgFirst)} · 平均作答 ${formatDuration(avgAnswer)}`;
    el.sourceLine.textContent = `${question.deck || "题库"} · ${question.chapter || "未分章节"} · 原题 ${question.sourceNumber || "-"}${pageText}${editedText}${timingText}`;
    el.favoriteBtn.classList.remove("hidden");
    el.editAnswerBtn.classList.remove("hidden");
    el.favoriteBtn.textContent = isFavorite(question) ? "已收藏" : "收藏";
    el.favoriteBtn.classList.toggle("active-tool", isFavorite(question));
    el.editAnswerBtn.textContent = state.answerOverrides[question.uid] ? "编辑修订" : "修订答案";
    setQuestionText(question);
    setAnswerText(question);

    const selfCheck = usesSelfCheck(question);
    const draftMode = usesDraft(question);
    el.wordNotice.classList.add("hidden");
    el.conceptBox.classList.add("hidden");
    el.inputPanel.classList.toggle("hidden", selfCheck && !draftMode);
    el.answerInputLabel.textContent = draftMode ? "翻译草稿" : "你的答案";
    el.answerInput.placeholder = draftMode
      ? "这里可以随手写自己的翻译草稿，不评分、不保存为答案。"
      : "把你能回忆出的答案写在这里，再提交评分。";
    el.answerInput.disabled = state.resultVisible && !draftMode;
    el.answerInput.value = state.resultVisible ? state.lastUserAnswer : draftFor(question);
    el.clearDraftBtn.disabled = state.resultVisible && !draftMode;
    el.scoreBox.classList.toggle("hidden", !state.resultVisible || selfCheck);
    el.answerBox.classList.toggle("hidden", !state.resultVisible);
    el.answerEditor.classList.toggle("hidden", !state.editingAnswer);
    if (state.editingAnswer) {
      el.answerEditInput.value = effectiveAnswer(question);
    }
    el.submitActions.classList.toggle("hidden", state.resultVisible || selfCheck);
    el.selfCheckActions.classList.toggle("hidden", state.resultVisible || !selfCheck);
    el.nextActions.classList.toggle("hidden", !state.resultVisible);
    el.prevBtn.disabled = !canGoPrevious();

    if (state.resultVisible && !selfCheck) {
      const band = scoreBand(state.lastScore || 0);
      el.scoreValue.textContent = `${state.lastScore || 0} 分`;
      el.scoreLabel.textContent = band.label;
      el.scoreExplain.textContent = band.explain;
      el.scoreBox.className = `score-box ${band.className}`;
      renderConceptBox(question);
    } else if (!selfCheck) {
      el.answerInput.focus();
    }
  }

  function switchMode(mode) {
    saveCurrentDraft();
    saveMockAnswer();
    if (mode !== "mock") stopMockTimer();
    state.mode = mode;
    resetAnswerState();
    if (mode === "review") ensureReviewOrder();
    saveState();
    render();
  }

  function switchStudyMode() {
    saveCurrentDraft();
    saveMockAnswer();
    stopMockTimer();
    state.mode = "study";
    if (state.deck === PREDICTION_DECK) {
      state.deck = ALL_DECKS;
      state.file = ALL_FILES;
      state.group = ALL_GROUPS;
      state.subject = ALL_SUBJECTS;
      state.priority = ALL_PRIORITIES;
      state.favoriteFilter = ALL_FAVORITES;
      state.search = "";
    }
    resetAnswerState();
    saveState();
    render();
  }

  function switchPredictionMode() {
    saveCurrentDraft();
    saveMockAnswer();
    stopMockTimer();
    state.mode = "study";
    state.deck = PREDICTION_DECK;
    state.file = ALL_FILES;
    state.group = ALL_GROUPS;
    state.subject = ALL_SUBJECTS;
    state.priority = ALL_PRIORITIES;
    state.favoriteFilter = ALL_FAVORITES;
    state.search = "";
    resetAnswerState();
    saveState();
    render();
  }

  function switchUser(user) {
    saveCurrentDraft();
    saveState();
    currentUser = user;
    profileStore.currentUser = user;
    state = loadState();
    normalizeState();
    resetAnswerState();
    saveState();
    render();
  }

  function createUser() {
    const name = el.newUserInput.value.trim();
    if (!name) return;
    if (!profileStore.profiles[name]) {
      profileStore.profiles[name] = cloneDefaultState();
    }
    el.newUserInput.value = "";
    switchUser(name);
  }

  el.studyTab.addEventListener("click", switchStudyMode);
  el.predictionTab.addEventListener("click", switchPredictionMode);
  el.reviewTab.addEventListener("click", () => switchMode("review"));
  el.mockTab.addEventListener("click", () => switchMode("mock"));
  el.analysisTab.addEventListener("click", () => switchMode("analysis"));
  el.dataTab.addEventListener("click", () => switchMode("data"));

  el.userSelect.addEventListener("change", (event) => {
    switchUser(event.target.value);
  });

  el.createUserBtn.addEventListener("click", createUser);
  el.newUserInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") createUser();
  });

  el.deckFilter.addEventListener("change", (event) => {
    saveCurrentDraft();
    state.deck = event.target.value;
    state.file = ALL_FILES;
    state.group = ALL_GROUPS;
    state.subject = ALL_SUBJECTS;
    state.priority = ALL_PRIORITIES;
    resetAnswerState();
    saveState();
    render();
  });

  el.searchInput.addEventListener("input", (event) => {
    saveCurrentDraft();
    state.search = event.target.value;
    state.studyIndexByFilter[keyForCurrentFilter()] = 0;
    resetAnswerState();
    saveState();
    render();
    el.searchInput.focus();
  });

  el.fileFilter.addEventListener("change", (event) => {
    saveCurrentDraft();
    state.file = event.target.value;
    state.group = ALL_GROUPS;
    state.subject = ALL_SUBJECTS;
    state.priority = ALL_PRIORITIES;
    resetAnswerState();
    saveState();
    render();
  });

  el.groupFilter.addEventListener("change", (event) => {
    saveCurrentDraft();
    state.group = event.target.value;
    state.subject = ALL_SUBJECTS;
    state.priority = ALL_PRIORITIES;
    resetAnswerState();
    saveState();
    render();
  });

  el.subjectFilter.addEventListener("change", (event) => {
    saveCurrentDraft();
    state.subject = event.target.value;
    resetAnswerState();
    saveState();
    render();
  });

  el.priorityFilter.addEventListener("change", (event) => {
    saveCurrentDraft();
    state.priority = event.target.value;
    resetAnswerState();
    saveState();
    render();
  });

  el.favoriteFilter.addEventListener("change", (event) => {
    saveCurrentDraft();
    state.favoriteFilter = event.target.value;
    resetAnswerState();
    saveState();
    render();
  });

  el.submitAnswerBtn.addEventListener("click", submitCurrentAnswer);
  el.skipBtn.addEventListener("click", skipQuestion);
  el.favoriteBtn.addEventListener("click", toggleFavorite);
  el.editAnswerBtn.addEventListener("click", startAnswerEdit);
  el.saveAnswerEditBtn.addEventListener("click", saveAnswerEdit);
  el.cancelAnswerEditBtn.addEventListener("click", cancelAnswerEdit);
  el.resetAnswerEditBtn.addEventListener("click", resetAnswerEdit);
  el.familiarBtn.addEventListener("click", () => showSelfCheckAnswer(false));
  el.unclearBtn.addEventListener("click", () => showSelfCheckAnswer(true));
  el.skipSelfCheckBtn.addEventListener("click", skipQuestion);
  el.prevBtn.addEventListener("click", previousQuestion);
  el.nextBtn.addEventListener("click", nextQuestion);
  el.clearDraftBtn.addEventListener("click", clearCurrentDraft);
  el.startMockBtn.addEventListener("click", startMock);
  el.mockGroupList.addEventListener("change", saveMockGroupSelection);
  el.selectAllMockGroupsBtn.addEventListener("click", () => {
    state.mockGroups = professionalMockGroups();
    state.mockGroupsInitialized = true;
    saveState();
    renderMockGroupSelector();
  });
  el.clearMockGroupsBtn.addEventListener("click", () => {
    state.mockGroups = [];
    state.mockGroupsInitialized = true;
    saveState();
    renderMockGroupSelector();
    showMockRangeNotice("已清空范围。开始前请至少选择一个专业题大类。", false);
  });
  el.mockPrevBtn.addEventListener("click", () => moveMock(-1));
  el.mockNextBtn.addEventListener("click", () => moveMock(1));
  el.finishMockBtn.addEventListener("click", finishMock);
  el.mockAnswerInput.addEventListener("input", () => {
    clearTimeout(el.mockAnswerInput.saveTimer);
    el.mockAnswerInput.saveTimer = setTimeout(saveMockAnswer, 180);
  });
  el.exportAllBtn.addEventListener("click", exportAllData);
  el.exportWrongBtn.addEventListener("click", exportWrongData);
  el.exportFavoriteBtn.addEventListener("click", exportFavoriteData);
  el.exportEditsBtn.addEventListener("click", exportEditData);
  el.exportReviewBtn.addEventListener("click", exportReviewData);
  el.importBackupInput.addEventListener("change", (event) => importBackup(event.target.files && event.target.files[0]));
  el.answerInput.addEventListener("input", () => {
    const question = currentQuestion();
    if (!question || state.resultVisible) return;
    markFirstInput();
    clearTimeout(el.answerInput.saveTimer);
    el.answerInput.saveTimer = setTimeout(saveCurrentDraft, 180);
  });
  el.answerInput.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && !state.resultVisible) {
      if (usesSelfCheck(currentQuestion())) {
        showSelfCheckAnswer(false);
      } else {
        submitCurrentAnswer();
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!["study", "review"].includes(state.mode)) return;
    const tagName = event.target && event.target.tagName;
    const isTypingTarget = ["TEXTAREA", "INPUT", "SELECT"].includes(tagName) || event.target?.isContentEditable;
    if (isTypingTarget || state.editingAnswer) return;

    const question = currentQuestion();
    if (!question) return;

    if (state.resultVisible && (event.key === "Enter" || event.key === "ArrowRight")) {
      event.preventDefault();
      nextQuestion();
      return;
    }
    if (event.key === "ArrowLeft" && canGoPrevious()) {
      event.preventDefault();
      previousQuestion();
      return;
    }
    if (!state.resultVisible && usesSelfCheck(question)) {
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        showSelfCheckAnswer(false);
      } else if (["m", "u"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        showSelfCheckAnswer(true);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        skipQuestion();
      }
    }
  });

  window.addEventListener("beforeunload", () => {
    saveCurrentDraft();
    saveMockAnswer();
  });

  el.resetStudy.addEventListener("click", () => {
    state.studyIndexByFilter[keyForCurrentFilter()] = 0;
    resetAnswerState();
    saveState();
    render();
  });

  el.clearWrong.addEventListener("click", () => {
    state.wrongIds = [];
    state.reviewOrder = [];
    state.reviewIndex = 0;
    resetAnswerState();
    saveState();
    render();
  });

  document.addEventListener("mouseover", (event) => {
    const token = event.target.closest && event.target.closest(".align-token");
    if (!token) return;
    document.querySelectorAll(`.pair-${token.dataset.pair}`).forEach((item) => item.classList.add("active-align"));
  });

  document.addEventListener("mouseout", (event) => {
    const token = event.target.closest && event.target.closest(".align-token");
    if (!token) return;
    document.querySelectorAll(`.pair-${token.dataset.pair}`).forEach((item) => item.classList.remove("active-align"));
  });

  document.addEventListener("click", (event) => {
    const token = event.target.closest && event.target.closest(".clickable-token");
    if (!token) return;
    const reportItem = token.closest(".report-item");
    if (reportItem) {
      const question = questionByUid(reportItem.dataset.uid);
      const result = addAlignmentWordToWrong(token.dataset.pair, question);
      if (result) showInlineNotice(reportItem, result.message);
      return;
    }
    const result = addAlignmentWordToWrong(token.dataset.pair);
    if (result) showWordNotice(result.message);
  });

  render();
})();
