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

interface TrimesterPacingGuideProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const TrimesterPacingGuide = ({ darkMode, setDarkMode }: TrimesterPacingGuideProps) => {
    // Trimester lesson data - all activities are optional and toggleable
  const allLessons = [
    // Behavioral Economics (3 lessons)
    {id: 0, name: "Your Values and Money", unit: "Behavioral Economics", activity1: "Values and Money Activities", activity2: "", required: "No", nonActivityTime: 3, activityTime: 53, totalTime: 56},
    {id: 1, name: "Your Brain and Money", unit: "Behavioral Economics", activity1: "Brain and Money Activities", activity2: "", required: "No", nonActivityTime: 16, activityTime: 26, totalTime: 42},
    {id: 2, name: "Overcoming Cognitive Biases", unit: "Behavioral Economics", activity1: "Cognitive Bias Activities", activity2: "", required: "No", nonActivityTime: 3, activityTime: 31, totalTime: 34},

    // Banking (4 lessons)
    {id: 3, name: "Checking and Savings Accounts", unit: "Banking", activity1: "Account Comparison Activities", activity2: "", required: "No", nonActivityTime: 16, activityTime: 59, totalTime: 75},
    {id: 4, name: "Beware of Banking Fees", unit: "Banking", activity1: "Banking Fee Analysis", activity2: "", required: "No", nonActivityTime: 31, activityTime: 30, totalTime: 61},
    {id: 5, name: "Strategies to Save", unit: "Banking", activity1: "Savings Strategy Activities", activity2: "", required: "No", nonActivityTime: 41, activityTime: 30, totalTime: 71},
    {id: 6, name: "Online and Mobile Banking", unit: "Banking", activity1: "Digital Banking Activities", activity2: "", required: "No", nonActivityTime: 25, activityTime: 46, totalTime: 71},

    // Investing (7 lessons)
    {id: 7, name: "Why Should I Invest in the Stock Market?", unit: "Investing", activity1: "Stock Market Investment Activities", activity2: "", required: "No", nonActivityTime: 26, activityTime: 50, totalTime: 76},
    {id: 8, name: "What is a Stock?", unit: "Investing", activity1: "Stock Analysis Activities", activity2: "", required: "No", nonActivityTime: 32, activityTime: 60, totalTime: 92},
    {id: 9, name: "What is a Bond?", unit: "Investing", activity1: "Bond Analysis Activities", activity2: "", required: "No", nonActivityTime: 29, activityTime: 15, totalTime: 44},
    {id: 10, name: "Managing Risk", unit: "Investing", activity1: "Risk Management Activities", activity2: "", required: "No", nonActivityTime: 26, activityTime: 25, totalTime: 51},
    {id: 11, name: "Deep Dive Into Funds", unit: "Investing", activity1: "Investment Fund Activities", activity2: "", required: "No", nonActivityTime: 1, activityTime: 30, totalTime: 31},
    {id: 12, name: "Start Investing", unit: "Investing", activity1: "Investment Simulation Activities", activity2: "", required: "No", nonActivityTime: 27, activityTime: 55, totalTime: 82},
    {id: 13, name: "How to Invest for Retirement", unit: "Investing", activity1: "Retirement Planning Activities", activity2: "", required: "No", nonActivityTime: 34, activityTime: 30, totalTime: 64},

    // Types of Credit (4 lessons)
    {id: 14, name: "Intro to Credit", unit: "Types of Credit", activity1: "Credit Introduction Activities", activity2: "", required: "No", nonActivityTime: 9, activityTime: 24, totalTime: 33},
    {id: 15, name: "Credit Cards", unit: "Types of Credit", activity1: "Credit Card Activities", activity2: "", required: "No", nonActivityTime: 15, activityTime: 12, totalTime: 27},
    {id: 16, name: "Loan Fundamentals", unit: "Types of Credit", activity1: "Loan Analysis Activities", activity2: "", required: "No", nonActivityTime: 9, activityTime: 29, totalTime: 38},
    {id: 17, name: "Auto Loans", unit: "Types of Credit", activity1: "Auto Loan Calculation Activities", activity2: "", required: "No", nonActivityTime: 20, activityTime: 15, totalTime: 35},

    // Managing Credit (4 lessons)
    {id: 18, name: "Debt Management", unit: "Managing Credit", activity1: "Debt Management Activities", activity2: "", required: "No", nonActivityTime: 30, activityTime: 15, totalTime: 45},
    {id: 19, name: "Your Credit Report", unit: "Managing Credit", activity1: "Credit Report Activities", activity2: "", required: "No", nonActivityTime: 22, activityTime: 29, totalTime: 51},
    {id: 20, name: "Your Credit Score", unit: "Managing Credit", activity1: "Credit Score Activities", activity2: "", required: "No", nonActivityTime: 27, activityTime: 20, totalTime: 47},
    {id: 21, name: "Building Credit from Scratch", unit: "Managing Credit", activity1: "Credit Building Activities", activity2: "", required: "No", nonActivityTime: 21, activityTime: 20, totalTime: 41},

    // Paying for College (5 lessons)
    {id: 22, name: "Applying for the FAFSA", unit: "Paying for College", activity1: "FAFSA Application Activities", activity2: "", required: "No", nonActivityTime: 27, activityTime: 25, totalTime: 52},
    {id: 23, name: "Scholarships and Grants", unit: "Paying for College", activity1: "Scholarship Search Activities", activity2: "", required: "No", nonActivityTime: 32, activityTime: 35, totalTime: 67},
    {id: 24, name: "Student Loans", unit: "Paying for College", activity1: "Student Loan Analysis Activities", activity2: "", required: "No", nonActivityTime: 38, activityTime: 25, totalTime: 63},
    {id: 25, name: "Financial Aid Packages", unit: "Paying for College", activity1: "Financial Aid Analysis Activities", activity2: "", required: "No", nonActivityTime: 13, activityTime: 25, totalTime: 38},
    {id: 26, name: "Student Loan Repayment", unit: "Paying for College", activity1: "Loan Repayment Activities", activity2: "", required: "No", nonActivityTime: 28, activityTime: 20, totalTime: 48},

    // Career (3 lessons)
    {id: 27, name: "Building Your Career", unit: "Career", activity1: "Career Development Activities", activity2: "", required: "No", nonActivityTime: 25, activityTime: 25, totalTime: 50},
    {id: 28, name: "Resumes and Cover Letters", unit: "Career", activity1: "Resume Writing Activities", activity2: "", required: "No", nonActivityTime: 18, activityTime: 20, totalTime: 38},
    {id: 29, name: "The Interview", unit: "Career", activity1: "Interview Skills Activities", activity2: "", required: "No", nonActivityTime: 37, activityTime: 0, totalTime: 37},

    // Insurance (4 lessons)
    {id: 30, name: "Insurance 101", unit: "Insurance", activity1: "Insurance Fundamentals Activities", activity2: "", required: "No", nonActivityTime: 25, activityTime: 7, totalTime: 32},
    {id: 31, name: "Auto and Renters Insurance", unit: "Insurance", activity1: "Auto and Renters Insurance Activities", activity2: "", required: "No", nonActivityTime: 25, activityTime: 2, totalTime: 27},
    {id: 32, name: "How Health Insurance Works", unit: "Insurance", activity1: "Health Insurance Activities", activity2: "", required: "No", nonActivityTime: 14, activityTime: 34, totalTime: 48},
    {id: 33, name: "How to Access Health Insurance", unit: "Insurance", activity1: "Health Insurance Access Activities", activity2: "", required: "No", nonActivityTime: 36, activityTime: 20, totalTime: 56},

    // Taxes (5 lessons)
    {id: 34, name: "Taxes and Your Paystub", unit: "Taxes", activity1: "Paystub Analysis Activities", activity2: "", required: "No", nonActivityTime: 11, activityTime: 50, totalTime: 61},
    {id: 35, name: "The Tax Cycle and Job Paperwork", unit: "Taxes", activity1: "Tax Form Activities", activity2: "", required: "No", nonActivityTime: 2, activityTime: 45, totalTime: 47},
    {id: 36, name: "Teens and Taxes", unit: "Taxes", activity1: "Teen Tax Activities", activity2: "", required: "No", nonActivityTime: 20, activityTime: 20, totalTime: 40},
    {id: 37, name: "How to File Your Taxes", unit: "Taxes", activity1: "Tax Filing Activities", activity2: "", required: "No", nonActivityTime: 17, activityTime: 25, totalTime: 42},
    {id: 38, name: "Time to File", unit: "Taxes", activity1: "Tax Preparation Activities", activity2: "", required: "No", nonActivityTime: 5, activityTime: 45, totalTime: 50},

    // Budgeting (4 lessons)
    {id: 39, name: "Budgeting Strategies", unit: "Budgeting", activity1: "Budgeting Strategy Activities", activity2: "", required: "No", nonActivityTime: 22, activityTime: 30, totalTime: 52},
    {id: 40, name: "Budgeting for Rent and Food", unit: "Budgeting", activity1: "Housing and Food Budget Activities", activity2: "", required: "No", nonActivityTime: 38, activityTime: 45, totalTime: 83},
    {id: 41, name: "Budgeting for Transportation", unit: "Budgeting", activity1: "Transportation Budget Activities", activity2: "", required: "No", nonActivityTime: 36, activityTime: 20, totalTime: 56},
    {id: 42, name: "Build Your Budget", unit: "Budgeting", activity1: "Budget Creation Activities", activity2: "", required: "No", nonActivityTime: 20, activityTime: 115, totalTime: 135},

    // Consumer Skills (4 lessons)
    {id: 43, name: "Your Money & Social Media", unit: "Consumer Skills", activity1: "Social Media and Money Activities", activity2: "", required: "No", nonActivityTime: 29, activityTime: 20, totalTime: 49},
    {id: 44, name: "Advertisements & Dark Patterns", unit: "Consumer Skills", activity1: "Advertisement Analysis Activities", activity2: "", required: "No", nonActivityTime: 28, activityTime: 20, totalTime: 48},
    {id: 45, name: "Comparison Shopping", unit: "Consumer Skills", activity1: "Comparison Shopping Activities", activity2: "", required: "No", nonActivityTime: 28, activityTime: 70, totalTime: 98},
    {id: 46, name: "Identity Theft", unit: "Consumer Skills", activity1: "Identity Protection Activities", activity2: "", required: "No", nonActivityTime: 15, activityTime: 34, totalTime: 49}
  ];

  // Trimester-specific default settings (shorter term)
  const [settings, setSettings] = useState({
    classPeriodMinutes: 50,
    totalSchoolDays: 60, // Shorter trimester
    assessmentDays: 6,
    reviewDays: 5,
    nonTeachingDays: 4,
    administrativePercentage: 15
  });

  const [lessonSettings, setLessonSettings] = useState(() => {
    const initial: { [key: number]: { includeActivities: boolean; canToggleActivities: boolean; combinedWith: number | null; lessonEnabled: boolean } } = {};
    allLessons.forEach(lesson => {
      initial[lesson.id] = {
        includeActivities: true, // All activities start as active
        canToggleActivities: true, // All activities are toggleable in trimester
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
    const instructionalTime = lesson.nonActivityTime;
    const activityTime = includeActivities ? lesson.activityTime : 0;
    const totalLessonTime = instructionalTime + activityTime;
    
    const periodsNeeded = Math.ceil(totalLessonTime / effectiveClassTime);
    const totalAllocatedTime = periodsNeeded * effectiveClassTime;
    const leftoverTime = totalAllocatedTime - totalLessonTime;
    const timePerPeriod = totalLessonTime / periodsNeeded;
    const efficiency = Math.round((totalLessonTime / totalAllocatedTime) * 100);
    
    return {
      lessonTime: totalLessonTime,
      periodsNeeded,
      totalAllocatedTime,
      timePerPeriod: Math.round(timePerPeriod),
      leftoverTime: Math.round(leftoverTime),
      efficiency,
      status: periodsNeeded === 1 ? 'fits' : periodsNeeded === 2 ? 'tight' : 'challenging'
    };
  };

  const toggleAllOptionalActivities = () => {
    const newValue = !globalOptionalActivities;
    setGlobalOptionalActivities(newValue);
    
    setLessonSettings(prev => {
      const updated = { ...prev };
      // In trimester, all lessons are considered "optional" for activity toggling
      allLessons.forEach(lesson => {
        updated[lesson.id] = {
          ...updated[lesson.id],
          includeActivities: newValue
        };
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
    // In trimester, all activities are toggleable regardless of required status
    setLessonSettings(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        includeActivities: !prev[lessonId]?.includeActivities
      }
    }));
  };

  // Enhanced combination logic to find consecutive lessons that improve efficiency
  const findCombinablePartners = (targetLesson: LessonAnalysis) => {
    const timeConstraints = calculateAvailableTime();
    const effectiveClassTime = timeConstraints.effectiveMinutesPerClass;
    
    const targetTime = targetLesson.current.lessonTime;
    const currentEfficiency = targetLesson.current.efficiency; // Use the corrected efficiency
    
    // Only suggest combinations if current efficiency is below 85%
    if (currentEfficiency >= 85) return [];
    
    const remainingTime = effectiveClassTime - targetTime;
    
    // Need at least 10 minutes remaining to make combination worthwhile
    if (remainingTime < 10) return [];
    
    return results?.lessons?.filter(lesson => {
      if (lesson.unit !== targetLesson.unit) return false;
      if (lesson.id === targetLesson.id) return false;
      
      // Only consecutive lessons (adjacent IDs)
      const isAdjacent = Math.abs(lesson.id - targetLesson.id) === 1;
      if (!isAdjacent) return false;
      
      // Skip if either lesson is already combined
      if (lesson.combinedWith || targetLesson.combinedWith) return false;
      
      // Skip if partner lesson is disabled
      if (!lesson.lessonEnabled) return false;
      
      const partnerTime = lesson.current.lessonTime;
      const combinedTime = targetTime + partnerTime;
      
      // Combination must fit in one period
      if (combinedTime > effectiveClassTime) return false;
      
      // Combination should improve efficiency (aim for 70%+ efficiency)
      const combinedEfficiency = Math.round((combinedTime / effectiveClassTime) * 100);
      if (combinedEfficiency < 70) return false;
      
      // Skip very short lessons (under 8 minutes) as they're not substantial enough
      if (partnerTime < 8) return false;
      
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
        canToggleActivities: true, // All activities are toggleable in trimester
        hasFlexibility: withActivities.periodsNeeded !== withoutActivities.periodsNeeded, // All lessons have flexibility in trimester
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
        includeActivities: true, // All activities start active in trimester
        canToggleActivities: true, // All activities are toggleable in trimester
        combinedWith: null,
        lessonEnabled: true
      };
    });
    setLessonSettings(newLessonSettings);
    setCombinedLessons([]);
  };

  // CORRECT Priority Optimization for Trimester
  const optimizePacingGuide = () => {
    const timeConstraints = calculateAvailableTime();
    const effectiveClassTime = timeConstraints.effectiveMinutesPerClass;
    const availableDays = timeConstraints.availableTeachingDays;

    console.log(`TRIMESTER OPTIMIZATION: ${availableDays} days available`);

    const newLessonSettings = { ...lessonSettings };
    let newCombinedLessons: CombinedLesson[] = [];
    
    // STEP 1: Enable ALL lessons WITH ALL activities
    allLessons.forEach(lesson => {
      newLessonSettings[lesson.id] = {
        lessonEnabled: true,
        includeActivities: true, // Start with everything
        canToggleActivities: lesson.required === "No",
        combinedWith: null
      };
    });

    // STEP 2: Calculate periods with combinations
    const calculatePeriodsWithCombinations = () => {
      newCombinedLessons = []; // Reset
      
      // Get enabled lessons with current times
      const enabledLessons = allLessons.filter(lesson => newLessonSettings[lesson.id].lessonEnabled)
        .map(lesson => ({
          ...lesson,
          currentTime: newLessonSettings[lesson.id].includeActivities ? lesson.totalTime : lesson.nonActivityTime
        }));

      // Group by unit for combinations
      const lessonsByUnit: { [unit: string]: any[] } = {};
      enabledLessons.forEach(lesson => {
        if (!lessonsByUnit[lesson.unit]) lessonsByUnit[lesson.unit] = [];
        lessonsByUnit[lesson.unit].push(lesson);
      });

      let totalPeriods = 0;
      const used = new Set<number>();

      // Create combinations within units
      Object.values(lessonsByUnit).forEach(unitLessons => {
        unitLessons.sort((a, b) => a.currentTime - b.currentTime);
        
        for (let i = 0; i < unitLessons.length; i++) {
          if (used.has(unitLessons[i].id)) continue;
          
          const lesson1 = unitLessons[i];
          
          // Try to find combination partner
          let bestPartner = null;
          let bestCombinedTime = 0;
          
          for (let j = i + 1; j < unitLessons.length; j++) {
            if (used.has(unitLessons[j].id)) continue;
            
            const lesson2 = unitLessons[j];
            const combinedTime = lesson1.currentTime + lesson2.currentTime;
            
            // Can they fit together in one period?
            if (combinedTime <= effectiveClassTime) {
              if (combinedTime > bestCombinedTime) {
                bestPartner = lesson2;
                bestCombinedTime = combinedTime;
              }
            }
          }
          
          if (bestPartner) {
            // Combine them - counts as 1 period
            totalPeriods += 1;
            used.add(lesson1.id);
            used.add(bestPartner.id);
            
            newLessonSettings[lesson1.id].combinedWith = bestPartner.id;
            newLessonSettings[bestPartner.id].combinedWith = lesson1.id;
            
            newCombinedLessons.push({
              id: `${lesson1.id}-${bestPartner.id}`,
              lesson1: lesson1.id,
              lesson2: bestPartner.id,
              totalTime: bestCombinedTime,
              efficiency: Math.round((bestCombinedTime / effectiveClassTime) * 100)
            });
            
            console.log(`Combined lessons ${lesson1.id} + ${bestPartner.id} = ${bestCombinedTime}min`);
          } else {
            // Keep solo
            const periods = Math.ceil(lesson1.currentTime / effectiveClassTime);
            totalPeriods += periods;
            used.add(lesson1.id);
          }
        }
      });
      
      return totalPeriods;
    };

    let currentPeriods = calculatePeriodsWithCombinations();
    console.log(`Starting: ${currentPeriods} periods with all lessons + activities`);

    // STEP 3: FIRST PRIORITY - Turn off activities one by one (all are optional in trimester)
    while (currentPeriods > availableDays) {
      const optionalWithActivities = allLessons.filter(lesson => 
        newLessonSettings[lesson.id].lessonEnabled &&
        newLessonSettings[lesson.id].includeActivities
      );
      
      if (optionalWithActivities.length === 0) break;
      
      // Find which activity removal saves the most periods
      let bestSavings = 0;
      let bestLesson = null;
      
      for (const lesson of optionalWithActivities) {
        // Temporarily turn off activities
        newLessonSettings[lesson.id].includeActivities = false;
        const newPeriods = calculatePeriodsWithCombinations();
        const savings = currentPeriods - newPeriods;
        
        if (savings > bestSavings) {
          bestSavings = savings;
          bestLesson = lesson;
        }
        
        // Put it back for now
        newLessonSettings[lesson.id].includeActivities = true;
      }
      
      if (bestLesson && bestSavings > 0) {
        newLessonSettings[bestLesson.id].includeActivities = false;
        currentPeriods = calculatePeriodsWithCombinations();
        console.log(`Turned off activities for lesson ${bestLesson.id}, saved ${bestSavings} periods, now ${currentPeriods}`);
      } else {
        break; // Can't save any more periods by removing activities
      }
    }

    // STEP 4: SECOND PRIORITY - Remove lessons if still needed (all are optional in trimester)
    while (currentPeriods > availableDays) {
      const optionalLessons = allLessons.filter(lesson => 
        newLessonSettings[lesson.id].lessonEnabled
      );
      
      if (optionalLessons.length === 0) break;
      
      // Remove shortest lesson first
      const shortestLesson = optionalLessons.sort((a, b) => {
        const timeA = newLessonSettings[a.id].includeActivities ? a.totalTime : a.nonActivityTime;
        const timeB = newLessonSettings[b.id].includeActivities ? b.totalTime : b.nonActivityTime;
        return timeA - timeB;
      })[0];
      
      newLessonSettings[shortestLesson.id].lessonEnabled = false;
      currentPeriods = calculatePeriodsWithCombinations();
      console.log(`Removed lesson ${shortestLesson.id}, now ${currentPeriods} periods`);
    }

    console.log(`FINAL: ${currentPeriods} periods (target: ${availableDays}), ${newCombinedLessons.length} combinations`);

    // Apply settings
    setLessonSettings(newLessonSettings);
    setCombinedLessons(newCombinedLessons);
    
    // Calculate results
    const enabledLessons = allLessons.filter(lesson => newLessonSettings[lesson.id].lessonEnabled);
    const finalRequiredLessons = enabledLessons.filter(lesson => lesson.required === "Yes");
    const finalOptionalLessons = enabledLessons.filter(lesson => lesson.required === "No");
    const optionalWithActivities = finalOptionalLessons.filter(lesson => 
      newLessonSettings[lesson.id].includeActivities
    );
    
    return {
      totalLessons: enabledLessons.length,
      totalPeriods: currentPeriods,
      averageEfficiency: newCombinedLessons.length > 0 ? 
        Math.round(newCombinedLessons.reduce((sum, combo) => sum + combo.efficiency, 0) / newCombinedLessons.length) : 75,
      combinationsCreated: newCombinedLessons.length,
      dayUtilization: Math.round((currentPeriods / availableDays) * 100),
      requiredLessons: finalRequiredLessons.length,
      optionalLessonsSelected: finalOptionalLessons.length,
      optionalActivitiesIncluded: optionalWithActivities.length,
      optionalActivitiesRemoved: finalOptionalLessons.length - optionalWithActivities.length,
      availableDays: availableDays,
      periodsOver: Math.max(0, currentPeriods - availableDays)
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
          Trimester Pacing Guide
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Plan your trimester by selecting lessons and activities. No state standards are enforced - you have complete flexibility in lesson selection.
        </p>
      </div>

      {/* Note about Standards */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="text-blue-600 dark:text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            Trimester Course - Complete Flexibility
          </h3>
        </div>
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          This trimester version gives you complete control over lesson selection. No state standards are enforced, 
          allowing you to customize the curriculum based on your specific needs and time constraints.
        </p>
      </div>

      {/* Settings Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-800 dark:text-white">
          <Settings className="text-green-600 dark:text-green-400" size={24} />
          Trimester Constraints
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
              Our smart algorithm maximizes your trimester content by:
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
                    <strong>Time Optimization:</strong> Removed activities from {optimizationResults.optionalActivitiesRemoved} optional lessons to fit within your trimester constraints.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {results?.timeConstraints && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Trimester Time Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Total Days</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{results.timeConstraints.totalSchoolDays}</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Non-Instructional Days</p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">{results.timeConstraints.totalLostDays}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {results.timeConstraints.assessmentDays} assess + {results.timeConstraints.reviewDays} review + {results.timeConstraints.nonTeachingDays} other
              </p>
            </div>
          </div>
        </div>
      )}

      {results?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6 text-center">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Active Lessons</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{results.summary.totalLessons}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">of {results.summary.totalOriginalLessons} total</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6 text-center">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">Class Days Needed</p>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{results.summary.totalPeriods}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">vs {results.timeConstraints?.availableTeachingDays} available</p>
          </div>
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6 text-center ${results.summary.feasible ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'}`}>
            <p className={`text-sm font-medium ${results.summary.feasible ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'} mb-2`}>
              Trimester Fit
            </p>
            <p className={`text-3xl font-bold ${results.summary.feasible ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
              {results.summary.feasible ? 'FITS' : 'TOO MUCH'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {results.summary.periodsOverage > 0 ? `${results.summary.periodsOverage} days over` : 'Will fit in trimester'}
            </p>
          </div>
        </div>
      )}

      {/* Class Period Efficiency Analysis */}
      {results?.lessons && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">⚡ Class Period Efficiency Analysis</h3>
          {(() => {
            const timeConstraints = calculateAvailableTime();
            const effectiveClassTime = timeConstraints.effectiveMinutesPerClass;
            const enabledLessons = results.lessons.filter(lesson => lesson.lessonEnabled);
            
            // Calculate efficiency for individual and combined lessons
            let totalEfficiencySum = 0;
            let totalPeriods = 0;
            let lowEfficiencyLessons = [];
            let goodEfficiencyLessons = [];
            let possibleCombinations = [];
            
            const processedLessons = new Set();
            
            enabledLessons.forEach(lesson => {
              if (processedLessons.has(lesson.id)) return;
              
              if (lesson.combinedWith && !processedLessons.has(lesson.combinedWith)) {
                // Handle combined lessons
                const partner = enabledLessons.find(l => l.id === lesson.combinedWith);
                if (partner) {
                  const combinedTime = lesson.current.lessonTime + partner.current.lessonTime;
                  const efficiency = Math.round((combinedTime / effectiveClassTime) * 100);
                  totalEfficiencySum += efficiency;
                  totalPeriods += 1;
                  processedLessons.add(lesson.id);
                  processedLessons.add(lesson.combinedWith);
                  goodEfficiencyLessons.push({
                    name: `${lesson.name} + ${partner.name}`,
                    efficiency,
                    time: combinedTime,
                    type: 'combined'
                  });
                }
              } else if (!lesson.combinedWith) {
                // Handle individual lessons
                const efficiency = lesson.current.efficiency; // Use the corrected efficiency
                totalEfficiencySum += efficiency * lesson.current.periodsNeeded;
                totalPeriods += lesson.current.periodsNeeded;
                processedLessons.add(lesson.id);
                
                if (efficiency < 85) {
                  const partners = results.lessons.filter(l => 
                    l.unit === lesson.unit && 
                    Math.abs(l.id - lesson.id) === 1 && 
                    !l.combinedWith && 
                    l.lessonEnabled &&
                    l.current.lessonTime + lesson.current.lessonTime <= effectiveClassTime
                  );
                  
                  lowEfficiencyLessons.push({
                    name: lesson.name,
                    efficiency,
                    time: lesson.current.lessonTime,
                    type: 'individual',
                    canCombine: partners.length > 0,
                    partners: partners.slice(0, 2)
                  });
                } else {
                  goodEfficiencyLessons.push({
                    name: lesson.name,
                    efficiency,
                    time: lesson.current.lessonTime,
                    type: 'individual'
                  });
                }
              }
            });
            
            const averageEfficiency = totalPeriods > 0 ? Math.round(totalEfficiencySum / totalPeriods) : 0;
            const timeWasted = totalPeriods * effectiveClassTime - enabledLessons.filter(l => l.lessonEnabled).reduce((sum, l) => {
              if (l.combinedWith && l.id < l.combinedWith) {
                const partner = enabledLessons.find(p => p.id === l.combinedWith);
                return sum + l.current.lessonTime + (partner?.current.lessonTime || 0);
              } else if (!l.combinedWith) {
                return sum + l.current.lessonTime;
              }
              return sum;
            }, 0);
            
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${averageEfficiency >= 85 ? 'bg-green-50 dark:bg-green-900/20' : averageEfficiency >= 70 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <div className={`text-2xl font-bold ${averageEfficiency >= 85 ? 'text-green-700 dark:text-green-300' : averageEfficiency >= 70 ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'}`}>
                      {averageEfficiency}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Class Period Efficiency</div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {lowEfficiencyLessons.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Under 85% Efficiency</div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {Math.round(timeWasted)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Potentially Unused</div>
                  </div>
                </div>
                
                {lowEfficiencyLessons.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">
                      💡 Efficiency Improvement Opportunities
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {lowEfficiencyLessons.slice(0, 6).map((lesson, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                          <div>
                            <span className="font-medium">{lesson.name}</span>
                            <div className="text-amber-600 dark:text-amber-400">
                              {lesson.efficiency}% ({lesson.time}min)
                              {lesson.canCombine && <span className="ml-1">🔗 Can combine</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {lowEfficiencyLessons.length > 6 && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                        ...and {lowEfficiencyLessons.length - 6} more lessons with efficiency opportunities
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(lessonsByUnit).map(([unitName, lessons]) => {
          // Only count enabled lessons for unit summaries
          const enabledLessons = lessons.filter(lesson => lesson.lessonEnabled);
          const unitPeriods = enabledLessons.reduce((sum, lesson) => {
            // For combined lessons, only count once
            if (lesson.combinedWith) {
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
                                  {Math.round((combinedTime / timeConstraints.effectiveMinutesPerClass) * 100)}% efficiency
                                </div>
                                
                                {/* Detailed breakdown for combined lessons */}
                                <div className="text-xs bg-green-50 dark:bg-green-900/20 rounded p-2 space-y-1">
                                  <div className="font-medium text-green-700 dark:text-green-300">
                                    Single Period ({timeConstraints.effectiveMinutesPerClass} min allocated)
                                  </div>
                                  
                                  <div className="grid grid-cols-1 gap-1 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-blue-600 dark:text-blue-400">📚 Lesson 1:</span>
                                      <span>{lesson.current.lessonTime} min</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-purple-600 dark:text-purple-400">📚 Lesson 2:</span>
                                      <span>{partner.current.lessonTime} min</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                      <span className="text-gray-700 dark:text-gray-300">📖 Content Total:</span>
                                      <span>{combinedTime} min</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-1">
                                      <span className="text-amber-600 dark:text-amber-400">⏱️ Available for:</span>
                                      <span className="font-medium">{timeLeft} min</span>
                                    </div>
                                  </div>
                                  
                                  {timeLeft > 0 && (
                                    <div className="text-xs text-amber-600 dark:text-amber-400 italic">
                                      Discussion, review, transitions, or extension activities
                                    </div>
                                  )}
                                </div>
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
                              lesson.required === 'Yes' 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' 
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
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
                                <div className="text-sm text-gray-900 dark:text-white font-medium">
                                  {lesson.current.efficiency}% efficiency
                                </div>
                                
                                {/* Detailed time breakdown */}
                                <div className="text-xs bg-gray-50 dark:bg-gray-700 rounded p-2 space-y-1">
                                  <div className="font-medium text-gray-700 dark:text-gray-300">
                                    {lesson.current.periodsNeeded === 1 ? 'Single Period' : `${lesson.current.periodsNeeded} Periods`} 
                                    ({lesson.current.totalAllocatedTime} min allocated)
                                  </div>
                                  
                                  <div className="grid grid-cols-1 gap-1 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-blue-600 dark:text-blue-400">📚 Instruction:</span>
                                      <span>{lesson.nonActivityTime} min</span>
                                    </div>
                                    {lesson.currentIncludesActivities && lesson.activityTime > 0 && (
                                      <div className="flex justify-between">
                                        <span className="text-green-600 dark:text-green-400">🎯 Activities:</span>
                                        <span>{lesson.activityTime} min</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between font-medium">
                                      <span className="text-gray-700 dark:text-gray-300">📖 Content Total:</span>
                                      <span>{lesson.current.lessonTime} min</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-1">
                                      <span className="text-amber-600 dark:text-amber-400">⏱️ Available for:</span>
                                      <span className="font-medium">{lesson.current.leftoverTime} min</span>
                                    </div>
                                  </div>
                                  
                                  {lesson.current.leftoverTime > 0 && (
                                    <div className="text-xs text-amber-600 dark:text-amber-400 italic">
                                      Discussion, review, transitions, or extension activities
                                    </div>
                                  )}
                                </div>
                                
                                {/* Show efficiency improvement opportunities */}
                                {!lesson.combinedWith && (() => {
                                  const timeConstraints = calculateAvailableTime();
                                  const currentEfficiency = lesson.current.efficiency; // Use the corrected efficiency from calculateLessonFit
                                  const partners = findCombinablePartners(lesson);
                                  
                                  if (currentEfficiency < 85 && partners.length > 0) {
                                    return (
                                      <div className="space-y-1">
                                        <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                          🔄 Efficiency: {currentEfficiency}% - Can improve by combining:
                                        </div>
                                        {partners.slice(0, 2).map(partner => {
                                          const combinedTime = lesson.current.lessonTime + partner.current.lessonTime;
                                          const combinedEfficiency = Math.round((combinedTime / timeConstraints.effectiveMinutesPerClass) * 100);
                                          const improvement = combinedEfficiency - currentEfficiency;
                                          
                                          return (
                                            <button
                                              key={partner.id}
                                              onClick={() => combineLessons(lesson.id, partner.id)}
                                              className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded px-2 py-1 hover:bg-green-100 dark:hover:bg-green-900/50 focus:outline-none w-full text-left"
                                            >
                                              <Link size={10} />
                                              <div className="flex flex-col">
                                                <span>{partner.name} ({partner.current.lessonTime}min)</span>
                                                <span className="text-green-600 dark:text-green-400 font-medium">
                                                  → {combinedTime}min total = {combinedEfficiency}% (+{improvement}%)
                                                </span>
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    );
                                  } else if (currentEfficiency < 85) {
                                    return (
                                      <div className="text-xs text-amber-600 dark:text-amber-500">
                                        ⚠️ Efficiency: {currentEfficiency}% - No consecutive lessons available to combine
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div className="text-xs text-green-600 dark:text-green-400">
                                        ✅ Good efficiency: {currentEfficiency}%
                                      </div>
                                    );
                                  }
                                })()}
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

export default TrimesterPacingGuide; 