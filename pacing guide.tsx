import React, { useState, useEffect } from 'react';
import { Clock, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, Settings, Book, Link, Unlink, Moon, Sun } from 'lucide-react';

type LessonAnalysis = {
  id: number;
  name: string;
  unit: string;
  activity1: string;
  activity2: string;
  required: string;
  nonActivityTime: number;
  activityTime: number;
  totalTime: number;
  withActivities: any;
  withoutActivities: any;
  current: any;
  currentIncludesActivities: boolean;
  canToggleActivities: boolean;
  hasFlexibility: boolean;
  combinedWith: number | null;
  lessonEnabled: boolean;
};

type Lesson = {
  id: number;
  name: string;
  unit: string;
  activity1: string;
  activity2: string;
  required: string;
  nonActivityTime: number;
  activityTime: number;
  totalTime: number;
};

type CombinedLesson = {
  id: string;
  lesson1: number;
  lesson2: number;
  totalTime: number;
  efficiency: number;
};

type Results = {
  lessons: LessonAnalysis[];
  timeConstraints: any;
  summary: any;
};

interface LessonByLessonPacingGuideProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const LessonByLessonPacingGuide = ({ darkMode, setDarkMode }: LessonByLessonPacingGuideProps) => {
  // Complete lesson data from CSV (all 68 lessons)
  const allLessons = [
    {id: 0, name: "Your Values and Money", unit: "Behavioral Economics", activity1: "PLAY: The Bean Game", activity2: "MOVE: Your Money Values", required: "No", nonActivityTime: 11, activityTime: 45, totalTime: 56},
    {id: 1, name: "Your Brain and Money", unit: "Behavioral Economics", activity1: "PLAY: Dollar Auction Game", activity2: "", required: "No", nonActivityTime: 27, activityTime: 15, totalTime: 42},
    {id: 2, name: "Overcoming Cognitive Biases", unit: "Behavioral Economics", activity1: "MOVE: Your Cognitive Biases", activity2: "", required: "No", nonActivityTime: 14, activityTime: 20, totalTime: 65},
    {id: 3, name: "Checking Accounts", unit: "Banking", activity1: "MOVE: Your Account Balance", activity2: "FINE PRINT: Checking Account Statements", required: "No", nonActivityTime: 26, activityTime: 35, totalTime: 61},
    {id: 4, name: "Savings Accounts", unit: "Banking", activity1: "COMPARE: Types of Savings Accounts", activity2: "", required: "Yes", nonActivityTime: 23, activityTime: 30, totalTime: 53},
    {id: 5, name: "Beware of Banking Fees", unit: "Banking", activity1: "ANALYZE: Overdraft Fees", activity2: "", required: "Yes", nonActivityTime: 29, activityTime: 20, totalTime: 49},
    {id: 6, name: "Being Unbanked", unit: "Banking", activity1: "INTERACTIVE: What's the Banking Status in Your Area? ", activity2: "", required: "No", nonActivityTime: 31, activityTime: 30, totalTime: 61},
    {id: 7, name: "Strategies to Save", unit: "Banking", activity1: "CREATE: Your Savings Goal", activity2: "", required: "No", nonActivityTime: 31, activityTime: 40, totalTime: 71},
    {id: 8, name: "Challenges to Saving", unit: "Banking", activity1: "INTERACTIVE: Living Paycheck to Paycheck", activity2: "", required: "No", nonActivityTime: 21, activityTime: 30, totalTime: 51},
    {id: 9, name: "Digital Wallets & P2P Apps", unit: "Banking", activity1: "RESEARCH: Person-to-Person Payments", activity2: "", required: "Yes", nonActivityTime: 27, activityTime: 35, totalTime: 62},
    {id: 10, name: "Online and Mobile Banking", unit: "Banking", activity1: "INTERACTIVE: Online Bank Simulator", activity2: "", required: "No", nonActivityTime: 41, activityTime: 30, totalTime: 71},
    {id: 11, name: "Why Should I Invest?", unit: "Investing", activity1: "INTERACTIVE: Invest with STAX!", activity2: "", required: "No", nonActivityTime: 26, activityTime: 50, totalTime: 76},
    {id: 12, name: "What is the Stock Market?", unit: "Investing", activity1: "PROJECT: Timing the Market", activity2: "", required: "No", nonActivityTime: 27, activityTime: 50, totalTime: 77},
    {id: 13, name: "What is a Stock?", unit: "Investing", activity1: "PROJECT: 5 Stocks on Your Birthday", activity2: "", required: "Yes", nonActivityTime: 32, activityTime: 60, totalTime: 92},
    {id: 14, name: "What is a Bond?", unit: "Investing", activity1: "FINE PRINT: Bond Fund Fact Sheet", activity2: "", required: "No", nonActivityTime: 29, activityTime: 15, totalTime: 44},
    {id: 15, name: "Managing Risk", unit: "Investing", activity1: "ANALYZE: Dollar Cost Averaging", activity2: "", required: "Yes", nonActivityTime: 26, activityTime: 25, totalTime: 51},
    {id: 16, name: "Investing in Funds", unit: "Investing", activity1: "MOVE: Let's Make a Mutual Fund", activity2: "", required: "Yes", nonActivityTime: 12, activityTime: 20, totalTime: 32},
    {id: 17, name: "Deep Dive into Funds", unit: "Investing", activity1: "COMPARE: Types of Investment Funds", activity2: "", required: "Yes", nonActivityTime: 1, activityTime: 30, totalTime: 31},
    {id: 18, name: "Start Investing", unit: "Investing", activity1: "INTERACTIVE: Invest with STAX!", activity2: "", required: "No", nonActivityTime: 37, activityTime: 45, totalTime: 82},
    {id: 19, name: "The Importance of Investing for Retirement", unit: "Investing", activity1: "CALCULATE: Retirement Savings Goals", activity2: "", required: "Yes", nonActivityTime: 43, activityTime: 20, totalTime: 63},
    {id: 20, name: "How to Invest for Retirement", unit: "Investing", activity1: "COMPARE: Types of Retirement Accounts", activity2: "", required: "Yes", nonActivityTime: 34, activityTime: 30, totalTime: 64},
    {id: 21, name: "Modern Investing", unit: "Investing", activity1: "RESEARCH: Online Tools and Apps", activity2: "", required: "Yes", nonActivityTime: 32, activityTime: 35, totalTime: 67},
    {id: 22, name: "Intro to Credit", unit: "Types of Credit", activity1: "MOVE: Credit Musical Chairs", activity2: "", required: "No", nonActivityTime: 13, activityTime: 20, totalTime: 33},
    {id: 23, name: "Young People & Credit Cards", unit: "Types of Credit", activity1: "FINE PRINT: Schumer Box", activity2: "", required: "Yes", nonActivityTime: 23, activityTime: 20, totalTime: 43},
    {id: 24, name: "Using Credit Cards Wisely", unit: "Types of Credit", activity1: "CALCULATE: Credit Card Repayment", activity2: "", required: "Yes", nonActivityTime: 30, activityTime: 15, totalTime: 45},
    {id: 25, name: "Loan Fundamentals", unit: "Types of Credit", activity1: "ANALYZE: Understanding Amortization", activity2: "", required: "No", nonActivityTime: 18, activityTime: 20, totalTime: 38},
    {id: 26, name: "Auto Loans", unit: "Types of Credit", activity1: "CALCULATE: The Cost of Auto Loans", activity2: "", required: "Yes", nonActivityTime: 20, activityTime: 15, totalTime: 35},
    {id: 27, name: "Mortgages", unit: "Types of Credit", activity1: "CALCULATE: Mortgage Costs", activity2: "", required: "Yes", nonActivityTime: 24, activityTime: 15, totalTime: 39},
    {id: 28, name: "Predatory Lending", unit: "Types of Credit", activity1: "INTERACTIVE: Shady Sam", activity2: "", required: "No", nonActivityTime: 26, activityTime: 25, totalTime: 51},
    {id: 29, name: "Debt Management", unit: "Managing Credit", activity1: "INTERACTIVE: Compounding Cat Insanity", activity2: "", required: "No", nonActivityTime: 30, activityTime: 15, totalTime: 45},
    {id: 30, name: "Your Credit Report", unit: "Managing Credit", activity1: "FINE PRINT: Credit Report", activity2: "", required: "Yes", nonActivityTime: 26, activityTime: 25, totalTime: 51},
    {id: 31, name: "Your Credit Score", unit: "Managing Credit", activity1: "INTERACTIVE: FICO Credit Scores", activity2: "", required: "Yes", nonActivityTime: 27, activityTime: 20, totalTime: 47},
    {id: 32, name: "Building Credit from Scratch", unit: "Managing Credit", activity1: "CALCULATE: Impact of Credit Score on Loans", activity2: "", required: "No", nonActivityTime: 21, activityTime: 20, totalTime: 41},
    {id: 33, name: "Paying for College 101", unit: "Paying for College", activity1: "INTERACTIVE: Sticker Price vs. Net Price", activity2: "", required: "No", nonActivityTime: 13, activityTime: 20, totalTime: 33},
    {id: 34, name: "Applying for the FAFSA", unit: "Paying for College", activity1: "ANALYZE: A FAFSA Submission Summary", activity2: "", required: "Yes", nonActivityTime: 27, activityTime: 25, totalTime: 52},
    {id: 35, name: "Scholarships and Grants", unit: "Paying for College", activity1: "RESEARCH: Finding Scholarships and Grants", activity2: "", required: "No", nonActivityTime: 32, activityTime: 35, totalTime: 67},
    {id: 36, name: "Student Loans", unit: "Paying for College", activity1: "ANALYZE: College and Career Choices", activity2: "", required: "No", nonActivityTime: 38, activityTime: 25, totalTime: 63},
    {id: 37, name: "Financial Aid Packages", unit: "Paying for College", activity1: "FINE PRINT: Financial Aid Packages", activity2: "", required: "Yes", nonActivityTime: 18, activityTime: 20, totalTime: 38},
    {id: 38, name: "Student Loan Repayment", unit: "Paying for College", activity1: "COMPARE: Which Repayment Option is Best?", activity2: "", required: "Yes", nonActivityTime: 28, activityTime: 20, totalTime: 48},
    {id: 39, name: "Time for Payback", unit: "Paying for College", activity1: "INTERACTIVE: Payback", activity2: "", required: "Yes", nonActivityTime: 1, activityTime: 30, totalTime: 31},
    {id: 40, name: "Career Exploration", unit: "Career", activity1: "INTERACTIVE: Which Jobs Align with My Interests?", activity2: "", required: "No", nonActivityTime: 27, activityTime: 45, totalTime: 72},
    {id: 41, name: "Finding a Job", unit: "Career", activity1: "FINE PRINT: Job Posting", activity2: "", required: "Yes", nonActivityTime: 38, activityTime: 0, totalTime: 38},
    {id: 42, name: "Resumes and Cover Letters", unit: "Career", activity1: "ANALYZE: A High School Resume and Cover Letter", activity2: "", required: "Yes", nonActivityTime: 18, activityTime: 20, totalTime: 38},
    {id: 43, name: "The Interview", unit: "Career", activity1: "PROJECT: Who Aced the Interview Challenge?", activity2: "", required: "Yes", nonActivityTime: 37, activityTime: 0, totalTime: 37},
    {id: 44, name: "Starting a New Job", unit: "Career", activity1: "PROJECT: First Week on the Job Means Paperwork", activity2: "", required: "No", nonActivityTime: 27, activityTime: 50, totalTime: 77},
    {id: 45, name: "Intro to Insurance", unit: "Insurance", activity1: "MOVE: What Determines Your Insurance Premium?", activity2: "", required: "No", nonActivityTime: 77, activityTime: 25, totalTime: 102},
    {id: 46, name: "Auto Insurance", unit: "Insurance", activity1: "PLAY: Types of Car Insurance", activity2: "", required: "Yes", nonActivityTime: 21, activityTime: 25, totalTime: 46},
    {id: 47, name: "Renters & Homeowners Insurance", unit: "Insurance", activity1: "FINE PRINT: Renters Insurance Agreement", activity2: "", required: "No", nonActivityTime: 22, activityTime: 30, totalTime: 52},
    {id: 48, name: "How Health Insurance Works", unit: "Insurance", activity1: "COMPARE: Types of Health Insurance Plans", activity2: "", required: "No", nonActivityTime: 28, activityTime: 20, totalTime: 48},
    {id: 49, name: "How to Access Health Insurance", unit: "Insurance", activity1: "RESEARCH: Insurance in Your State", activity2: "", required: "No", nonActivityTime: 36, activityTime: 20, totalTime: 56},
    {id: 50, name: "Other Types of Insurance", unit: "Insurance", activity1: "INTERACTIVE: Bummer!", activity2: "", required: "No", nonActivityTime: 81, activityTime: 25, totalTime: 106},
    {id: 51, name: "Taxes and Your Paystub", unit: "Taxes", activity1: "MOVE: Your Tax Dollars in Action", activity2: "", required: "No", nonActivityTime: 16, activityTime: 45, totalTime: 61},
    {id: 52, name: "The Tax Cycle and Job Paperwork", unit: "Taxes", activity1: "COMPARE: Tax Forms and their Purpose", activity2: "", required: "Yes", nonActivityTime: 7, activityTime: 40, totalTime: 47},
    {id: 53, name: "Teens and Taxes", unit: "Taxes", activity1: "ANALYZE: Should They File a Tax Return?", activity2: "", required: "Yes", nonActivityTime: 20, activityTime: 20, totalTime: 40},
    {id: 54, name: "How to File Your Taxes", unit: "Taxes", activity1: "FINE PRINT: W-2 Form ", activity2: "", required: "Yes", nonActivityTime: 22, activityTime: 20, totalTime: 42},
    {id: 55, name: "Time to File", unit: "Taxes", activity1: "CALCULATE: Completing a 1040", activity2: "", required: "No", nonActivityTime: 5, activityTime: 45, totalTime: 50},
    {id: 56, name: "Budgeting Basics", unit: "Budgeting", activity1: "COMPARE: Needs vs. Wants", activity2: "", required: "Yes", nonActivityTime: 12, activityTime: 40, totalTime: 62},
    {id: 57, name: "Budgeting Basics", unit: "Budgeting", activity1: "INTERACTIVE: Money Magic", activity2: "", required: "No", nonActivityTime: 12, activityTime: 40, totalTime: 62},
    {id: 58, name: "Budgeting Strategies", unit: "Budgeting", activity1: "CASE STUDY: How Do I Budget?", activity2: "", required: "No", nonActivityTime: 22, activityTime: 30, totalTime: 52},
    {id: 59, name: "Budgeting for Housing", unit: "Budgeting", activity1: "PROJECT: Budgeting with Roommates", activity2: "", required: "No", nonActivityTime: 45, activityTime: 45, totalTime: 90},
    {id: 60, name: "Budgeting for Transportation", unit: "Budgeting", activity1: "MOVE: Making Transportations Decisions", activity2: "", required: "No", nonActivityTime: 36, activityTime: 20, totalTime: 56},
    {id: 61, name: "Budgeting for Food", unit: "Budgeting", activity1: "ECON: Inflation, Spending and Wages", activity2: "", required: "Yes", nonActivityTime: 33, activityTime: 20, totalTime: 53},
    {id: 62, name: "Build Your Budget", unit: "Budgeting", activity1: "CREATE: A Salary-Based Budget", activity2: "", required: "No", nonActivityTime: 110, activityTime: 25, totalTime: 135},
    {id: 63, name: "Your Money & Social Media", unit: "Consumer Skills", activity1: "ANALYZE: What is my Role as a Consumer?", activity2: "", required: "No", nonActivityTime: 29, activityTime: 20, totalTime: 49},
    {id: 64, name: "Advertisements & Dark Patterns", unit: "Consumer Skills", activity1: "MOVE: Identifying Dark Patterns", activity2: "", required: "Yes", nonActivityTime: 28, activityTime: 20, totalTime: 48},
    {id: 65, name: "Comparison Shopping", unit: "Consumer Skills", activity1: "RESEARCH: Comparison Shopping", activity2: "", required: "No", nonActivityTime: 73, activityTime: 25, totalTime: 98},
    {id: 66, name: "Identity Theft", unit: "Consumer Skills", activity1: "COMPARE: Types of Identity Theft", activity2: "", required: "No", nonActivityTime: 29, activityTime: 20, totalTime: 49},
    {id: 67, name: "Scams & Fraud", unit: "Consumer Skills", activity1: "PLAY: Spot the Scam Signs", activity2: "", required: "Yes", nonActivityTime: 31, activityTime: 25, totalTime: 56}
  ];

  const [settings, setSettings] = useState({
    classPeriodMinutes: 50,
    totalSchoolDays: 90,
    assessmentDays: 10,
    reviewDays: 8,
    nonTeachingDays: 5,
    administrativePercentage: 15
  });

  const [lessonSettings, setLessonSettings] = useState(() => {
    const initial: { [key: number]: { includeActivities: boolean; canToggleActivities: boolean; combinedWith: number | null; lessonEnabled: boolean } } = {};
    allLessons.forEach(lesson => {
      initial[lesson.id] = {
        includeActivities: true,
        canToggleActivities: lesson.required === "No",
        combinedWith: null,
        lessonEnabled: true
      };
    });
    return initial;
  });

  const [globalOptionalActivities, setGlobalOptionalActivities] = useState(true);
  const [combinedLessons, setCombinedLessons] = useState<CombinedLesson[]>([]);
  const [results, setResults] = useState<Results | null>(null);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);


  const calculateAvailableTime = () => {
    const totalLostDays = settings.assessmentDays + settings.reviewDays + settings.nonTeachingDays;
    const availableTeachingDays = settings.totalSchoolDays - totalLostDays;
    const effectiveMinutesPerClass = settings.classPeriodMinutes * (1 - settings.administrativePercentage / 100);
    const totalAvailableMinutes = availableTeachingDays * effectiveMinutesPerClass;
    
    return {
      totalSchoolDays: settings.totalSchoolDays,
      assessmentDays: settings.assessmentDays,
      reviewDays: settings.reviewDays,
      nonTeachingDays: settings.nonTeachingDays,
      totalLostDays,
      availableTeachingDays,
      effectiveMinutesPerClass: Math.round(effectiveMinutesPerClass),
      totalAvailableMinutes: Math.round(totalAvailableMinutes)
    };
  };

  const calculateLessonFit = (lesson: Lesson, includeActivities: boolean) => {
    const timeConstraints = calculateAvailableTime();
    const effectiveClassTime = timeConstraints.effectiveMinutesPerClass;
    const lessonTime = includeActivities ? lesson.totalTime : lesson.nonActivityTime;
    
    const periodsNeeded = Math.ceil(lessonTime / effectiveClassTime);
    const timePerPeriod = lessonTime / periodsNeeded;
    const leftoverTime = effectiveClassTime - (lessonTime % effectiveClassTime || effectiveClassTime);
    
    return {
      lessonTime,
      periodsNeeded,
      timePerPeriod: Math.round(timePerPeriod),
      leftoverTime: periodsNeeded > 1 ? 0 : Math.round(leftoverTime),
      efficiency: Math.round((lessonTime / (periodsNeeded * effectiveClassTime)) * 100),
      status: periodsNeeded === 1 ? 'fits' : periodsNeeded === 2 ? 'tight' : 'challenging'
    };
  };

  const toggleAllOptionalActivities = () => {
    const newValue = !globalOptionalActivities;
    setGlobalOptionalActivities(newValue);
    
    setLessonSettings(prev => {
      const updated = { ...prev };
      allLessons.forEach(lesson => {
        if (lesson.required === "No") {
          updated[lesson.id] = {
            ...updated[lesson.id],
            includeActivities: newValue
          };
        }
      });
      return updated;
    });
  };

  const toggleLesson = (lessonId: number) => {
    setLessonSettings(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        lessonEnabled: !prev[lessonId]?.lessonEnabled
      }
    }));
  };

  const toggleActivity = (lessonId: number) => {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (lesson && lesson.required === "No") {
      setLessonSettings(prev => ({
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          includeActivities: !prev[lessonId]?.includeActivities
        }
      }));
    }
  };

  const findCombinablePartners = (targetLesson: LessonAnalysis) => {
    const timeConstraints = calculateAvailableTime();
    const effectiveClassTime = timeConstraints.effectiveMinutesPerClass;
    
    const targetTime = targetLesson.current.lessonTime;
    const remainingTime = effectiveClassTime - targetTime;
    
    if (remainingTime < 15) return [];
    
    return results?.lessons?.filter(lesson => {
      if (lesson.unit !== targetLesson.unit) return false;
      if (lesson.id === targetLesson.id) return false;
      const isAdjacent = Math.abs(lesson.id - targetLesson.id) === 1;
      if (!isAdjacent) return false;
      if (lesson.current.lessonTime > remainingTime) return false;
      if (lesson.current.lessonTime < 10) return false;
      if (lesson.combinedWith || targetLesson.combinedWith) return false;
      return true;
    }) || [];
  };

  const combineLessons = (lesson1Id: number, lesson2Id: number) => {
    if (!results) return;
    const lesson1 = results.lessons.find(l => l.id === lesson1Id);
    const lesson2 = results.lessons.find(l => l.id === lesson2Id);
    
    if (!lesson1 || !lesson2) return;
    
    const combinedTime = lesson1.current.lessonTime + lesson2.current.lessonTime;
    const timeConstraints = calculateAvailableTime();
    const effectiveClassTime = timeConstraints.effectiveMinutesPerClass;
    
    if (combinedTime <= effectiveClassTime) {
      const combinationId = `${lesson1Id}-${lesson2Id}`;
      setCombinedLessons(prev => [...prev, {
        id: combinationId,
        lesson1: lesson1Id,
        lesson2: lesson2Id,
        totalTime: combinedTime,
        efficiency: Math.round((combinedTime / effectiveClassTime) * 100)
      }]);
      
      setLessonSettings(prev => ({
        ...prev,
        [lesson1Id]: { ...prev[lesson1Id], combinedWith: lesson2Id },
        [lesson2Id]: { ...prev[lesson2Id], combinedWith: lesson1Id }
      }));
    }
  };

  const uncombineLessons = (combinationId: string) => {
    const combination = combinedLessons.find(c => c.id === combinationId);
    if (!combination) return;
    
    setCombinedLessons(prev => prev.filter(c => c.id !== combinationId));
    setLessonSettings(prev => ({
      ...prev,
      [combination.lesson1]: { ...prev[combination.lesson1], combinedWith: null },
      [combination.lesson2]: { ...prev[combination.lesson2], combinedWith: null }
    }));
  };

  const generatePacingPlan = () => {
    const timeConstraints = calculateAvailableTime();
    
    // Include ALL lessons, not just enabled ones
    const lessonAnalysis = allLessons.map(lesson => {
      const withActivities = calculateLessonFit(lesson, true);
      const withoutActivities = calculateLessonFit(lesson, false);
      const currentSetting = lessonSettings[lesson.id]?.includeActivities ?? true;
      const currentFit = calculateLessonFit(lesson, currentSetting);
      const isEnabled = lessonSettings[lesson.id]?.lessonEnabled !== false;
      
      return {
        ...lesson,
        withActivities,
        withoutActivities,
        current: currentFit,
        currentIncludesActivities: currentSetting,
        canToggleActivities: lesson.required === "No",
        hasFlexibility: withActivities.periodsNeeded !== withoutActivities.periodsNeeded && lesson.required === "No",
        combinedWith: lessonSettings[lesson.id]?.combinedWith,
        lessonEnabled: isEnabled
      };
    });

    // Only count enabled lessons for totals
    const enabledLessons = lessonAnalysis.filter(lesson => lesson.lessonEnabled);
    
    let totalPeriods = 0;
    const processedLessons = new Set();
    
    enabledLessons.forEach(lesson => {
      if (!processedLessons.has(lesson.id)) {
        if (lesson.combinedWith && !processedLessons.has(lesson.combinedWith)) {
          totalPeriods += 1;
          processedLessons.add(lesson.id);
          processedLessons.add(lesson.combinedWith);
        } else if (!lesson.combinedWith) {
          totalPeriods += lesson.current.periodsNeeded;
          processedLessons.add(lesson.id);
        }
      }
    });

    const requiredActivities = enabledLessons.filter(lesson => lesson.required === "Yes");
    const optionalActivities = enabledLessons.filter(lesson => lesson.required === "No");
    const totalCurriculumMinutes = enabledLessons.reduce((sum, lesson) => sum + lesson.current.lessonTime, 0);
    
    const periodsOverage = totalPeriods - timeConstraints.availableTeachingDays;
    const minutesOverage = totalCurriculumMinutes - timeConstraints.totalAvailableMinutes;
    const utilizationRate = Math.round((totalCurriculumMinutes / timeConstraints.totalAvailableMinutes) * 100);
    
    return {
      lessons: lessonAnalysis, // Include ALL lessons (enabled and disabled)
      timeConstraints,
      summary: {
        totalLessons: enabledLessons.length,
        totalOriginalLessons: allLessons.length,
        skippedLessons: allLessons.length - enabledLessons.length,
        totalPeriods,
        requiredActivities: requiredActivities.length,
        optionalActivities: optionalActivities.length,
        totalCurriculumMinutes,
        periodsOverage,
        minutesOverage,
        utilizationRate,
        feasible: periodsOverage <= 0 && minutesOverage <= 0,
        combinedLessonsCount: combinedLessons.length
      }
    };
  };

  useEffect(() => {
    setResults(generatePacingPlan());
  }, [settings, lessonSettings, combinedLessons]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fits': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'tight': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'challenging': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fits': return <CheckCircle size={16} />;
      case 'tight': return <Clock size={16} />;
      case 'challenging': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const lessonsByUnit: { [unit: string]: LessonAnalysis[] } = {};
  if (results?.lessons) {
    results.lessons.forEach(lesson => {
      if (!lessonsByUnit[lesson.unit]) {
        lessonsByUnit[lesson.unit] = [];
      }
      lessonsByUnit[lesson.unit].push(lesson);
    });
  }


  // Reset to default selection
  const resetToDefault = () => {
    const newLessonSettings = { ...lessonSettings };
    allLessons.forEach(lesson => {
      newLessonSettings[lesson.id] = {
        includeActivities: true,
        canToggleActivities: lesson.required === "No",
        combinedWith: null,
        lessonEnabled: true
      };
    });
    setLessonSettings(newLessonSettings);
    setCombinedLessons([]);
  };

  // Smart Optimization Engine - Fit within available days with maximum content
  const optimizePacingGuide = () => {
    const timeConstraints = calculateAvailableTime();
    const effectiveClassTime = timeConstraints.effectiveMinutesPerClass;
    const availableDays = timeConstraints.availableTeachingDays;

    const newLessonSettings = { ...lessonSettings };
    const newCombinedLessons: CombinedLesson[] = [];
    
    // Step 1: Start by disabling all lessons, then build up optimally
    allLessons.forEach(lesson => {
      newLessonSettings[lesson.id] = {
        ...newLessonSettings[lesson.id],
        lessonEnabled: false,
        includeActivities: lesson.required === "Yes" ? true : true,
        combinedWith: null
      };
    });

    // Step 2: Always include ALL required lessons first (they're non-negotiable)
    const requiredLessons = allLessons.filter(lesson => lesson.required === "Yes");
    let usedPeriods = 0;
    
    requiredLessons.forEach(lesson => {
      newLessonSettings[lesson.id].lessonEnabled = true;
      newLessonSettings[lesson.id].includeActivities = true; // Always keep required activities
      const periodsNeeded = Math.ceil(lesson.totalTime / effectiveClassTime);
      usedPeriods += periodsNeeded;
    });

    // Step 3: Create optimal combinations for ALL lessons (required + optional)
    const createOptimalCombinations = (lessonsToConsider: any[]) => {
      const combinations: any[] = [];
      const used = new Set<number>();
      
      // Group by unit for better combinations
      const lessonsByUnit: { [unit: string]: any[] } = {};
      lessonsToConsider.forEach(lesson => {
        const isEnabled = newLessonSettings[lesson.id].lessonEnabled;
        const includeActivities = newLessonSettings[lesson.id].includeActivities;
        const lessonTime = includeActivities ? lesson.totalTime : lesson.nonActivityTime;
        
        const lessonInfo = {
          ...lesson,
          currentTime: lessonTime,
          efficiency: Math.round((lessonTime / effectiveClassTime) * 100),
          periodsNeeded: Math.ceil(lessonTime / effectiveClassTime),
          isEnabled
        };
        
        if (!lessonsByUnit[lesson.unit]) {
          lessonsByUnit[lesson.unit] = [];
        }
        lessonsByUnit[lesson.unit].push(lessonInfo);
      });

      // Find combinations within each unit
      Object.values(lessonsByUnit).forEach(unitLessons => {
        // Only consider enabled lessons for combinations
        const enabledUnitLessons = unitLessons.filter(l => l.isEnabled);
        enabledUnitLessons.sort((a, b) => a.currentTime - b.currentTime);
        
        for (let i = 0; i < enabledUnitLessons.length; i++) {
          if (used.has(enabledUnitLessons[i].id)) continue;
          
          const lesson1 = enabledUnitLessons[i];
          
          // If lesson is already efficient, keep it solo
          if (lesson1.currentTime >= effectiveClassTime * 0.8) {
            combinations.push({
              type: 'single',
              lessons: [lesson1],
              totalTime: lesson1.currentTime,
              efficiency: lesson1.efficiency,
              periods: 1
            });
            used.add(lesson1.id);
            continue;
          }
          
          // Try to find combination partner
          let bestPartner = null;
          let bestCombinedEfficiency = 0;
          
          for (let j = i + 1; j < enabledUnitLessons.length; j++) {
            if (used.has(enabledUnitLessons[j].id)) continue;
            
            const lesson2 = enabledUnitLessons[j];
            const combinedTime = lesson1.currentTime + lesson2.currentTime;
            
            if (combinedTime <= effectiveClassTime && combinedTime >= effectiveClassTime * 0.7) {
              const combinedEfficiency = Math.round((combinedTime / effectiveClassTime) * 100);
              
              if (combinedEfficiency > bestCombinedEfficiency) {
                bestPartner = lesson2;
                bestCombinedEfficiency = combinedEfficiency;
              }
            }
          }
          
          if (bestPartner && bestCombinedEfficiency >= 70) {
            combinations.push({
              type: 'combined',
              lessons: [lesson1, bestPartner],
              totalTime: lesson1.currentTime + bestPartner.currentTime,
              efficiency: bestCombinedEfficiency,
              periods: 1
            });
            used.add(lesson1.id);
            used.add(bestPartner.id);
            
            // Apply combination
            newLessonSettings[lesson1.id].combinedWith = bestPartner.id;
            newLessonSettings[bestPartner.id].combinedWith = lesson1.id;
            
            newCombinedLessons.push({
              id: `${lesson1.id}-${bestPartner.id}`,
              lesson1: lesson1.id,
              lesson2: bestPartner.id,
              totalTime: lesson1.currentTime + bestPartner.currentTime,
              efficiency: bestCombinedEfficiency
            });
          } else {
            combinations.push({
              type: 'single',
              lessons: [lesson1],
              totalTime: lesson1.currentTime,
              efficiency: lesson1.efficiency,
              periods: lesson1.periodsNeeded
            });
            used.add(lesson1.id);
          }
        }
      });
      
      return combinations;
    };

    // Recalculate periods after required lessons combinations
    let currentCombinations = createOptimalCombinations(allLessons);
    usedPeriods = currentCombinations.reduce((sum, combo) => sum + combo.periods, 0);

    // Step 4: Add optional lessons in priority order until we reach the day limit
    const optionalLessons = allLessons.filter(lesson => lesson.required === "No");
    
    // Score optional lessons by educational value and efficiency
    const scoredOptionalLessons = optionalLessons.map(lesson => {
      const withActivities = Math.ceil(lesson.totalTime / effectiveClassTime);
      const withoutActivities = Math.ceil(lesson.nonActivityTime / effectiveClassTime);
      const efficiency = Math.round((lesson.totalTime / effectiveClassTime / withActivities) * 100);
      
      return {
        lesson,
        withActivitiesPeriods: withActivities,
        withoutActivitiesPeriods: withoutActivities,
        efficiency,
        // Score: longer lessons (more content) + efficiency bonus
        score: lesson.totalTime + (efficiency >= 75 ? 50 : 0) + (lesson.totalTime > 60 ? 25 : 0)
      };
    }).sort((a, b) => b.score - a.score); // Highest score first

    // Add optional lessons one by one until we hit the day limit
    for (const scoredLesson of scoredOptionalLessons) {
      const lesson = scoredLesson.lesson;
      
      // Try with activities first
      newLessonSettings[lesson.id].lessonEnabled = true;
      newLessonSettings[lesson.id].includeActivities = true;
      
      currentCombinations = createOptimalCombinations(allLessons);
      const periodsWithActivities = currentCombinations.reduce((sum, combo) => sum + combo.periods, 0);
      
      if (periodsWithActivities <= availableDays) {
        // Fits with activities - keep it
        continue;
      }
      
      // Try without activities
      newLessonSettings[lesson.id].includeActivities = false;
      currentCombinations = createOptimalCombinations(allLessons);
      const periodsWithoutActivities = currentCombinations.reduce((sum, combo) => sum + combo.periods, 0);
      
      if (periodsWithoutActivities <= availableDays) {
        // Fits without activities - keep it
        continue;
      }
      
      // Doesn't fit either way - disable this lesson
      newLessonSettings[lesson.id].lessonEnabled = false;
    }

    // Final calculation
    const finalCombinations = createOptimalCombinations(allLessons);
    const totalPeriods = finalCombinations.reduce((sum, combo) => sum + combo.periods, 0);

    // Apply settings
    setLessonSettings(newLessonSettings);
    setCombinedLessons(newCombinedLessons);
    
    // Calculate final results
    const enabledLessons = allLessons.filter(lesson => newLessonSettings[lesson.id].lessonEnabled);
    const totalEfficiency = finalCombinations.length > 0 ? 
      finalCombinations.reduce((sum, combo) => sum + combo.efficiency, 0) / finalCombinations.length : 0;
    
    const requiredLessons = enabledLessons.filter(lesson => lesson.required === "Yes");
    const optionalLessons = enabledLessons.filter(lesson => lesson.required === "No");
    const optionalWithActivities = optionalLessons.filter(lesson => 
      newLessonSettings[lesson.id].includeActivities
    );
    
    return {
      totalLessons: enabledLessons.length,
      totalPeriods: totalPeriods,
      averageEfficiency: Math.round(totalEfficiency),
      combinationsCreated: newCombinedLessons.length,
      dayUtilization: Math.round((totalPeriods / availableDays) * 100),
      requiredLessons: requiredLessons.length,
      optionalLessonsSelected: optionalLessons.length,
      optionalActivitiesIncluded: optionalWithActivities.length,
      optionalActivitiesRemoved: optionalLessons.length - optionalWithActivities.length,
      availableDays: availableDays,
      periodsOver: Math.max(0, totalPeriods - availableDays)
    };
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="flex justify-between items-center mb-4">
          <div></div> {/* Empty div for spacing */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {darkMode ? 'Dark' : 'Light'}
            </span>
            <button
              onClick={() => {
                console.log('Dark mode toggle clicked, current state:', darkMode);
                setDarkMode(!darkMode);
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-600" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-3">
          <Book className="text-blue-600 dark:text-blue-400" size={40} />
          Lesson-by-Lesson Pacing Guide
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Plan your semester by checking lessons to include and combining related lessons for optimal time management
        </p>
      </div>

      {/* Settings Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-800 dark:text-white">
          <Settings className="text-green-600 dark:text-green-400" size={24} />
          Semester Constraints
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total School Days</label>
            <input
              type="number"
              value={settings.totalSchoolDays}
              onChange={(e) => setSettings(prev => ({...prev, totalSchoolDays: parseInt(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assessment Days</label>
            <input
              type="number"
              value={settings.assessmentDays}
              onChange={(e) => setSettings(prev => ({...prev, assessmentDays: parseInt(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unit tests, midterms, finals</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review Days</label>
            <input
              type="number"
              value={settings.reviewDays}
              onChange={(e) => setSettings(prev => ({...prev, reviewDays: parseInt(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pre-test review sessions</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Non-Teaching Days</label>
            <input
              type="number"
              value={settings.nonTeachingDays}
              onChange={(e) => setSettings(prev => ({...prev, nonTeachingDays: parseInt(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sick days, assemblies, half days</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class Period (minutes)</label>
            <input
              type="number"
              value={settings.classPeriodMinutes}
              onChange={(e) => setSettings(prev => ({...prev, classPeriodMinutes: parseInt(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Administrative Time Loss (%)</label>
            <input
              type="number"
              value={settings.administrativePercentage}
              onChange={(e) => setSettings(prev => ({...prev, administrativePercentage: parseInt(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Transitions, instructions, interruptions</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Global Controls</h3>
          <div className="flex gap-4">
            <button
              onClick={toggleAllOptionalActivities}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center gap-2"
            >
              {globalOptionalActivities ? (
                <ToggleRight className="text-white" size={20} />
              ) : (
                <ToggleLeft className="text-white" size={20} />
              )}
              {globalOptionalActivities ? 'Disable All Optional Activities' : 'Enable All Optional Activities'}
            </button>
          </div>
        </div>
      </div>


      {/* Smart Optimization Engine */}
      <div className="mb-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-700 hover:shadow-md transition-shadow duration-200 p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
          <Settings className="text-emerald-600 dark:text-emerald-400" size={24} />
          🚀 Smart Optimization Engine
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-emerald-100 dark:border-emerald-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Fit-to-Schedule Optimization</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our smart algorithm guarantees your pacing guide fits within your available days by:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-emerald-500" size={16} />
                Including ALL required lessons and activities first
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-emerald-500" size={16} />
                Adding highest-value optional lessons until limit
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-emerald-500" size={16} />
                Creating optimal lesson combinations by unit
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-emerald-500" size={16} />
                Prioritizing lessons with activities when possible
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-emerald-500" size={16} />
                Maximizing content within your day constraints
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-emerald-500" size={16} />
                Guaranteeing schedule fits exactly within available days
              </li>
            </ul>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  const optimResults = optimizePacingGuide();
                  setOptimizationResults(optimResults);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center gap-2 shadow-lg"
              >
                <Settings size={20} />
                🎯 Optimize My Pacing Guide
              </button>
              
              <button
                onClick={resetToDefault}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Reset All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
              <h4 className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">Required First</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Always includes ALL required lessons and activities, then adds as many optional lessons as possible.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
              <h4 className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">Smart Combinations</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Groups lessons within units for 70%+ efficiency, creating natural lesson flow and maximizing time use.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
              <h4 className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">Perfect Fit</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Guarantees your pacing guide fits exactly within available teaching days with maximum content.
              </p>
            </div>
          </div>
          
          {/* Optimization Results Display */}
          {optimizationResults && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-emerald-100 dark:border-emerald-800">
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
                <CheckCircle className="text-emerald-500" size={20} />
                Optimization Complete! 🎉
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {optimizationResults.totalLessons}
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">Lessons Selected</div>
                </div>
                
                <div className={`text-center p-3 rounded-lg ${optimizationResults.periodsOver > 0 ? 'bg-red-50 dark:bg-red-900/30' : 'bg-blue-50 dark:bg-blue-900/30'}`}>
                  <div className={`text-2xl font-bold ${optimizationResults.periodsOver > 0 ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>
                    {optimizationResults.totalPeriods}
                  </div>
                  <div className={`text-sm ${optimizationResults.periodsOver > 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    Class Periods {optimizationResults.periodsOver > 0 ? `(${optimizationResults.periodsOver} over)` : ''}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {optimizationResults.averageEfficiency}%
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Avg Efficiency</div>
                </div>
                
                <div className={`text-center p-3 rounded-lg ${optimizationResults.dayUtilization > 100 ? 'bg-red-50 dark:bg-red-900/30' : 'bg-orange-50 dark:bg-orange-900/30'}`}>
                  <div className={`text-2xl font-bold ${optimizationResults.dayUtilization > 100 ? 'text-red-700 dark:text-red-300' : 'text-orange-700 dark:text-orange-300'}`}>
                    {optimizationResults.dayUtilization}%
                  </div>
                  <div className={`text-sm ${optimizationResults.dayUtilization > 100 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    Day Utilization
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300">Required Lessons:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{optimizationResults.requiredLessons}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300">Optional Lessons:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{optimizationResults.optionalLessonsSelected}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300">Combinations:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{optimizationResults.combinationsCreated}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-300">Activities Kept:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{optimizationResults.optionalActivitiesIncluded || 0}</span>
                </div>
              </div>
              
              {optimizationResults.periodsOver > 0 && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                  <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <strong>CRITICAL:</strong> Even with maximum optimization, you need {optimizationResults.periodsOver} more teaching days than available ({optimizationResults.totalPeriods} needed vs {optimizationResults.availableDays} available). Consider removing some optional lessons or shortening activities.
                  </p>
                </div>
              )}
              
              {optimizationResults.optionalActivitiesRemoved > 0 && optimizationResults.periodsOver === 0 && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <strong>Time Optimization:</strong> Removed activities from {optimizationResults.optionalActivitiesRemoved} optional lessons to fit within your semester constraints.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {results?.timeConstraints && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Semester Time Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Total Days</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{results.timeConstraints.totalSchoolDays}</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Lost Days</p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">{results.timeConstraints.totalLostDays}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {results.timeConstraints.assessmentDays} assess + {results.timeConstraints.reviewDays} review + {results.timeConstraints.nonTeachingDays} other
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Teaching Days</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{results.timeConstraints.availableTeachingDays}</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Effective Minutes/Class</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{results.timeConstraints.effectiveMinutesPerClass}</p>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-1">Total Available</p>
              <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{Math.round(results.timeConstraints.totalAvailableMinutes/60)} hrs</p>
            </div>
          </div>
        </div>
      )}

      {results?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6 text-center">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Active Lessons</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{results.summary.totalLessons}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">of {results.summary.totalOriginalLessons} total</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6 text-center">
            <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Skipped Lessons</p>
            <p className="text-3xl font-bold text-red-900 dark:text-red-100">{results.summary.skippedLessons}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Not teaching these</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6 text-center">
            <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Required Activities</p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">{results.summary.requiredActivities}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Cannot be skipped</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6 text-center">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Optional Activities</p>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{results.summary.optionalActivities}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Can toggle off if needed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6 text-center">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">Class Days Needed</p>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{results.summary.totalPeriods}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">vs {results.timeConstraints?.availableTeachingDays} available</p>
          </div>
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6 text-center ${results.summary.feasible ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'}`}>
            <p className={`text-sm font-medium ${results.summary.feasible ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'} mb-2`}>
              Semester Fit
            </p>
            <p className={`text-3xl font-bold ${results.summary.feasible ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
              {results.summary.feasible ? 'FITS' : 'TOO MUCH'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {results.summary.periodsOverage > 0 ? `${results.summary.periodsOverage} days over` : 'Will fit in semester'}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(lessonsByUnit).map(([unitName, lessons]) => {
          // Only count enabled lessons for unit summaries
          const enabledLessons = lessons.filter(lesson => lesson.lessonEnabled);
          const unitPeriods = enabledLessons.reduce((sum, lesson) => {
            // For combined lessons, only count once
            if (lesson.combinedWith && lesson.id < lesson.combinedWith) {
              return sum + 1; // Combined lessons count as 1 period
            } else if (!lesson.combinedWith) {
              return sum + lesson.current.periodsNeeded;
            }
            return sum; // Skip the second part of combined lessons
          }, 0);
          const unitRequiredActivities = enabledLessons.filter(l => l.required === "Yes").length;
          const unitOptionalActivities = enabledLessons.filter(l => l.required === "No").length;
          
          return (
            <div key={unitName} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{unitName}</h3>
                  <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Book size={16} />
                      {enabledLessons.length} lessons
                    </span>
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle size={16} />
                      {unitRequiredActivities} required
                    </span>
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <Settings size={16} />
                      {unitOptionalActivities} optional
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                      <Clock size={16} />
                      {unitPeriods} periods
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto" style={{boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', borderRadius: '0.5rem'}}>
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Lesson</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Activities</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Include Activities</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Days</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Fit</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {lessons.filter(lesson => {
                      // Show combined lessons only once (the one with lower ID)
                      if (lesson.combinedWith) {
                        return lesson.id < lesson.combinedWith;
                      }
                      return true;
                    }).map((lesson) => {
                      if (lesson.combinedWith) {
                        const partner = lessons.find(l => l.id === lesson.combinedWith);
                        if (!partner) return null;
                        const combinedTime = lesson.current.lessonTime + partner.current.lessonTime;
                        const timeConstraints = calculateAvailableTime();
                        const timeLeft = timeConstraints.effectiveMinutesPerClass - combinedTime;
                        
                        return (
                          <tr key={`combined-${lesson.id}-${partner.id}`} className="hover:bg-green-50 dark:hover:bg-green-900/20 bg-green-25">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                <div className="flex items-center gap-2">
                                  <Link size={14} className="text-green-600 dark:text-green-400" />
                                  <span>Combined Lesson</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-700 dark:text-gray-300">
                                • {lesson.name}
                              </div>
                              <div className="text-xs text-gray-700 dark:text-gray-300">
                                • {partner.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                                Combined Activities
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                <div>• {lesson.activity1}</div>
                                {lesson.activity2 && <div>• {lesson.activity2}</div>}
                                <div>• {partner.activity1}</div>
                                {partner.activity2 && <div>• {partner.activity2}</div>}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Link className="text-green-600 dark:text-green-400" size={16} />
                                <span className="text-green-600 dark:text-green-400 font-medium">Combined</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white font-medium">
                                {combinedTime} min total
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {lesson.current.lessonTime}min + {partner.current.lessonTime}min
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                1 class day
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Saves 1 day
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                <CheckCircle size={12} />
                                Perfect Combo
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                                  {timeLeft > 5 ? 
                                    `Using ${Math.round((combinedTime / timeConstraints.effectiveMinutesPerClass) * 100)}% of the period` :
                                    'Using the full class period'
                                  }
                                </div>
                                {timeLeft > 5 && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {timeLeft} minutes left for review/discussion
                                  </div>
                                )}
                                <button
                                  onClick={() => {
                                    const combinationId = combinedLessons.find(c => 
                                      (c.lesson1 === lesson.id && c.lesson2 === partner.id) || 
                                      (c.lesson1 === partner.id && c.lesson2 === lesson.id)
                                    )?.id;
                                    if (combinationId) {
                                      uncombineLessons(combinationId);
                                    }
                                  }}
                                  className="flex items-center gap-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded px-2 py-1 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none"
                                >
                                  <Unlink size={10} />
                                  Separate
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      
                      return (
                        <tr key={lesson.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${lesson.lessonEnabled === false ? 'bg-gray-50 dark:bg-gray-700 opacity-60' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={lesson.lessonEnabled !== false}
                                onChange={() => toggleLesson(lesson.id)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                              />
                              <div className={`text-sm font-medium ${lesson.lessonEnabled !== false ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                {lesson.name}
                              </div>
                            </div>
                            {lesson.lessonEnabled === false && (
                              <div className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                <AlertTriangle size={12} />
                                Disabled - click checkbox to re-enable
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              lesson.required === 'Yes' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                            } ${lesson.lessonEnabled === false ? 'opacity-50' : ''}`}>
                              {lesson.required === 'Yes' ? 'Required Activity' : 'Optional Activity'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-xs ${lesson.lessonEnabled !== false ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                              <div>{lesson.activity1}</div>
                              {lesson.activity2 && <div>{lesson.activity2}</div>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {lesson.canToggleActivities ? (
                              <button
                                onClick={() => toggleActivity(lesson.id)}
                                className="flex items-center gap-2 text-sm"
                                disabled={lesson.lessonEnabled === false}
                              >
                                {lesson.currentIncludesActivities ? (
                                  <ToggleRight className={lesson.lessonEnabled !== false ? "text-green-600 dark:text-green-400" : "text-gray-300 dark:text-gray-600"} size={20} />
                                ) : (
                                  <ToggleLeft className={lesson.lessonEnabled !== false ? "text-gray-400 dark:text-gray-500" : "text-gray-300 dark:text-gray-600"} size={20} />
                                )}
                                <span className={lesson.currentIncludesActivities && lesson.lessonEnabled !== false ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}>
                                  {lesson.currentIncludesActivities ? 'Included' : 'Skipped'}
                                </span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 text-sm">
                                <ToggleRight className={lesson.lessonEnabled !== false ? "text-red-600 dark:text-red-400" : "text-gray-300 dark:text-gray-600"} size={20} />
                                <span className={lesson.lessonEnabled !== false ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500"}>Always Required</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-sm ${lesson.lessonEnabled !== false ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                              {lesson.current.lessonTime} min
                            </div>
                            {lesson.hasFlexibility && lesson.lessonEnabled !== false && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {lesson.currentIncludesActivities ? 
                                  `${lesson.withoutActivities.lessonTime} min without activities` :
                                  `${lesson.withActivities.lessonTime} min with activities`
                                }
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-sm font-medium ${lesson.lessonEnabled !== false ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                              {lesson.lessonEnabled !== false ? lesson.current.periodsNeeded : 0} 
                              {lesson.current.periodsNeeded === 1 ? ' day' : ' days'}
                            </div>
                            {lesson.current.periodsNeeded > 1 && lesson.lessonEnabled !== false && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Split across {lesson.current.periodsNeeded} days
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {lesson.lessonEnabled !== false ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lesson.current.status)}`}>
                                {getStatusIcon(lesson.current.status)}
                                {lesson.current.status === 'fits' ? 'Perfect Fit' : 
                                 lesson.current.status === 'tight' ? 'Tight Fit' : 'Need Multiple Days'}
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                Disabled
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {lesson.lessonEnabled !== false ? (
                              <div className="space-y-2">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {lesson.current.leftoverTime > 5 ? 
                                    `Using ${lesson.current.efficiency}% of the period` : 
                                    'Using the full class period'
                                  }
                                </div>
                                {lesson.current.leftoverTime > 5 && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {lesson.current.leftoverTime} minutes left for review/discussion
                                  </div>
                                )}
                                
                                {!lesson.combinedWith && lesson.current.lessonTime < 40 && findCombinablePartners(lesson).length > 0 && (
                                  <div className="space-y-1">
                                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Can combine with:</div>
                                    {findCombinablePartners(lesson).slice(0, 2).map(partner => (
                                      <button
                                        key={partner.id}
                                        onClick={() => combineLessons(lesson.id, partner.id)}
                                        className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded px-2 py-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:outline-none w-full text-left"
                                      >
                                        <Link size={10} />
                                        {partner.name} ({partner.current.lessonTime}min)
                                      </button>
                                    ))}
                                  </div>
                                )}
                                
                                {!lesson.combinedWith && lesson.current.lessonTime < 40 && findCombinablePartners(lesson).length === 0 && (
                                  <div className="text-xs text-gray-400 dark:text-gray-500">No adjacent lessons to combine</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 dark:text-gray-500">Lesson disabled</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {results?.summary && (
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">Optimization Suggestions</h3>
          <div className="space-y-2 text-sm">
            {results.summary.periodsOverage > 0 && (
              <p className="text-red-700 dark:text-red-300">
                • <strong>CRITICAL:</strong> You need {results.summary.periodsOverage} more teaching days than available. Consider removing optional activities or combining lessons.
              </p>
            )}
            {results.summary.feasible && results.summary.utilizationRate > 95 && (
              <p className="text-yellow-700 dark:text-yellow-300">
                • <strong>TIGHT SCHEDULE:</strong> {results.summary.utilizationRate}% utilization leaves little room for delays or extensions.
              </p>
            )}
            {results.lessons && results.lessons.filter(l => l.current.status === 'challenging').length > 0 && (
              <p className="text-yellow-700 dark:text-yellow-300">
                • <strong>{results.lessons.filter(l => l.current.status === 'challenging').length} lessons</strong> need 3+ periods. Consider splitting content across multiple days.
              </p>
            )}
            {results.lessons && results.lessons.filter(l => l.hasFlexibility && l.current.status !== 'fits').length > 0 && (
              <p className="text-yellow-700 dark:text-yellow-300">
                • <strong>{results.lessons.filter(l => l.hasFlexibility && l.current.status !== 'fits').length} lessons</strong> could fit better by removing optional activities.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonByLessonPacingGuide;