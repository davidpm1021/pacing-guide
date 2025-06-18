import React, { useState, useEffect } from 'react';
import { Clock, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, Settings, Book, Link, Unlink, Moon, Sun, MapPin, Award } from 'lucide-react';

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

type StateStandard = {
  id: string;
  code: string;
  title: string;
  description: string;
  required: boolean;
};

type StateLessonMapping = {
  lessonId: number;
  standardIds: string[];
  required: boolean;
  priority: 'high' | 'medium' | 'low';
};

type State = {
  code: string;
  name: string;
  standards: StateStandard[];
  lessonMappings: StateLessonMapping[];
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
  // State standards data
  const statesData: State[] = [
    {
      code: 'ALL',
      name: 'All States (Default)',
      standards: [],
      lessonMappings: []
    },
    {
      code: 'CA',
      name: 'California',
      standards: [
        { id: 'ca-1', code: 'PFL.1.1', title: 'Financial Decision Making', description: 'Apply financial decision-making processes to financial scenarios', required: true },
        { id: 'ca-2', code: 'PFL.1.2', title: 'Banking Services', description: 'Analyze banking services and their costs', required: true },
        { id: 'ca-3', code: 'PFL.2.1', title: 'Investment Principles', description: 'Understand basic investment principles and risk/return', required: true },
        { id: 'ca-4', code: 'PFL.2.2', title: 'Credit Management', description: 'Analyze credit cards, loans, and credit scores', required: true },
        { id: 'ca-5', code: 'PFL.3.1', title: 'Career Planning', description: 'Develop career plans and understand job benefits', required: false },
        { id: 'ca-6', code: 'PFL.4.1', title: 'Budgeting', description: 'Create and manage personal budgets', required: true }
      ],
      lessonMappings: [
        { lessonId: 0, standardIds: ['ca-1'], required: true, priority: 'high' },
        { lessonId: 3, standardIds: ['ca-2'], required: true, priority: 'high' },
        { lessonId: 4, standardIds: ['ca-2'], required: true, priority: 'high' },
        { lessonId: 5, standardIds: ['ca-2'], required: true, priority: 'high' },
        { lessonId: 11, standardIds: ['ca-3'], required: true, priority: 'high' },
        { lessonId: 13, standardIds: ['ca-3'], required: true, priority: 'high' },
        { lessonId: 23, standardIds: ['ca-4'], required: true, priority: 'high' },
        { lessonId: 30, standardIds: ['ca-4'], required: true, priority: 'high' },
        { lessonId: 31, standardIds: ['ca-4'], required: true, priority: 'high' },
        { lessonId: 40, standardIds: ['ca-5'], required: false, priority: 'medium' },
        { lessonId: 56, standardIds: ['ca-6'], required: true, priority: 'high' }
      ]
    },
    {
      code: 'TX',
      name: 'Texas',
      standards: [
        { id: 'tx-1', code: 'PF.1A', title: 'Personal Financial Literacy', description: 'Identify and analyze personal financial goals', required: true },
        { id: 'tx-2', code: 'PF.2A', title: 'Banking and Financial Services', description: 'Compare banking services and financial institutions', required: true },
        { id: 'tx-3', code: 'PF.3A', title: 'Investment and Retirement', description: 'Analyze investment options and retirement planning', required: true },
        { id: 'tx-4', code: 'PF.4A', title: 'Credit and Debt', description: 'Evaluate credit and debt management strategies', required: true },
        { id: 'tx-5', code: 'PF.5A', title: 'Insurance', description: 'Understand insurance as risk management', required: true },
        { id: 'tx-6', code: 'PF.6A', title: 'Consumer Protection', description: 'Analyze consumer rights and protections', required: false }
      ],
      lessonMappings: [
        { lessonId: 0, standardIds: ['tx-1'], required: true, priority: 'high' },
        { lessonId: 3, standardIds: ['tx-2'], required: true, priority: 'high' },
        { lessonId: 4, standardIds: ['tx-2'], required: true, priority: 'high' },
        { lessonId: 11, standardIds: ['tx-3'], required: true, priority: 'high' },
        { lessonId: 19, standardIds: ['tx-3'], required: true, priority: 'high' },
        { lessonId: 23, standardIds: ['tx-4'], required: true, priority: 'high' },
        { lessonId: 30, standardIds: ['tx-4'], required: true, priority: 'high' },
        { lessonId: 46, standardIds: ['tx-5'], required: true, priority: 'high' },
        { lessonId: 64, standardIds: ['tx-6'], required: false, priority: 'medium' }
      ]
    },
    {
      code: 'FL',
      name: 'Florida',
      standards: [
        { id: 'fl-1', code: 'SS.912.FL.1.1', title: 'Values and Financial Decisions', description: 'Evaluate and reflect on how values affect personal financial decision-making', required: true },
        { id: 'fl-2', code: 'SS.912.FL.1.2', title: 'Cognitive Biases', description: 'Understand how cognitive biases affect personal financial decision-making', required: true },
        { id: 'fl-3', code: 'SS.912.FL.1.3', title: 'Loss Aversion', description: 'Explain that loss aversion implies that losses are weighed more than gains', required: true },
        { id: 'fl-4', code: 'SS.912.FL.1.5', title: 'Herd Mentality', description: 'Evaluate how herd mentality affects personal financial decision-making', required: true },
        { id: 'fl-5', code: 'SS.912.FL.1.6', title: 'Anchoring Bias', description: 'Describe how early information can anchor financial decisions', required: true },
        { id: 'fl-6', code: 'SS.912.FL.1.7', title: 'Confirmation Bias', description: 'Describe how people focus on information that confirms their beliefs', required: true },
        { id: 'fl-7', code: 'SS.912.FL.1.8', title: 'Present Bias', description: 'Identify examples of how people are affected by present bias', required: true },
        { id: 'fl-8', code: 'SS.912.FL.2.1', title: 'Career Choice Factors', description: 'Describe how people choose jobs based on income and non-income factors', required: true },
        { id: 'fl-9', code: 'SS.912.FL.2.2', title: 'Education Investment', description: 'Explain decisions to obtain education or training involve immediate costs for future benefits', required: true },
        { id: 'fl-10', code: 'SS.912.FL.2.3', title: 'Informed Career Decisions', description: 'Analyze ways to make informed education, job, or career decisions', required: true },
        { id: 'fl-11', code: 'SS.912.FL.3.1', title: 'Budgeting Fundamentals', description: 'Explain that budgeting involves making rational decisions', required: true },
        { id: 'fl-12', code: 'SS.912.FL.4.1', title: 'Banking Services', description: 'Analyze various banking services and their costs and benefits', required: true },
        { id: 'fl-13', code: 'SS.912.FL.5.1', title: 'Credit Fundamentals', description: 'Explain that credit allows people to purchase goods and services', required: true },
        { id: 'fl-14', code: 'SS.912.FL.6.1', title: 'Investment Principles', description: 'Explain that investors respond to incentives when deciding how to invest', required: true }
      ],
      lessonMappings: [
        { lessonId: 0, standardIds: ['fl-1'], required: true, priority: 'high' },
        { lessonId: 63, standardIds: ['fl-1'], required: true, priority: 'medium' },
        { lessonId: 1, standardIds: ['fl-2', 'fl-7'], required: true, priority: 'high' },
        { lessonId: 2, standardIds: ['fl-2', 'fl-3', 'fl-4', 'fl-5', 'fl-6', 'fl-7'], required: true, priority: 'high' },
        { lessonId: 40, standardIds: ['fl-8', 'fl-9', 'fl-10'], required: true, priority: 'high' },
        { lessonId: 44, standardIds: ['fl-8'], required: true, priority: 'medium' },
        { lessonId: 56, standardIds: ['fl-11'], required: true, priority: 'high' },
        { lessonId: 58, standardIds: ['fl-11'], required: true, priority: 'medium' },
        { lessonId: 62, standardIds: ['fl-11'], required: true, priority: 'high' },
        { lessonId: 3, standardIds: ['fl-12'], required: true, priority: 'high' },
        { lessonId: 4, standardIds: ['fl-12'], required: true, priority: 'high' },
        { lessonId: 5, standardIds: ['fl-12'], required: true, priority: 'high' },
        { lessonId: 22, standardIds: ['fl-13'], required: true, priority: 'high' },
        { lessonId: 23, standardIds: ['fl-13'], required: true, priority: 'high' },
        { lessonId: 24, standardIds: ['fl-13'], required: true, priority: 'high' },
        { lessonId: 11, standardIds: ['fl-14'], required: true, priority: 'high' },
        { lessonId: 12, standardIds: ['fl-14'], required: true, priority: 'high' },
        { lessonId: 13, standardIds: ['fl-14'], required: true, priority: 'high' }
      ]
    },
    {
      code: 'OH',
      name: 'Ohio',
      standards: [
        // FINANCIAL RESPONSIBILITY AND DECISION MAKING
        { id: 'oh-1', code: 'FR.1', title: 'Financial Accountability', description: 'Financial responsibility entails being accountable for managing money to satisfy current and future economic choices', required: true },
        { id: 'oh-2', code: 'FR.2', title: 'Decision Making Strategies', description: 'Financial responsibility involves life-long decision-making strategies which include consideration of alternatives and consequences', required: true },
        { id: 'oh-3', code: 'FR.3', title: 'Earning Potential Factors', description: 'Competencies, commitment, competition, training, work ethic, abilities and attitude impact earning potential and employability', required: true },
        { id: 'oh-4', code: 'FR.4', title: 'Income Sources', description: 'Income sources include job earnings, entrepreneurship, investments, government payments, grants, inheritances, etc.', required: true },
        { id: 'oh-5', code: 'FR.5', title: 'Take Home Pay Impact', description: 'Taxes, retirement, insurance, employment benefits, and deductions impact take home pay', required: true },
        
        // PLANNING AND MONEY MANAGEMENT
        { id: 'oh-6', code: 'PM.1', title: 'Budgeting Plan', description: 'Financial responsibility includes the development of a spending and savings plan (personal budget)', required: true },
        { id: 'oh-7', code: 'PM.2', title: 'Financial Institution Services', description: 'Financial institutions offer a variety of products and services to address financial responsibility', required: true },
        { id: 'oh-8', code: 'Standard 8', title: 'Financial Expert Guidance', description: 'Financial experts provide guidance and advice on a wide variety of financial issues', required: true },
        { id: 'oh-9', code: 'PM.4', title: 'Tax Planning Responsibility', description: 'Planning for and paying local, state and federal taxes is a financial responsibility', required: true },
        { id: 'oh-10', code: 'PM.5', title: 'Tax Credits and Deductions', description: 'Tax payers may save money by understanding and using tax credits and deductions', required: true },
        
        // INFORMED CONSUMER
        { id: 'oh-11', code: 'IC.1', title: 'Budget-Based Purchasing', description: 'An informed consumer makes decisions on purchases that may include a decision-making strategy to determine if purchases are within their budget', required: true },
        { id: 'oh-12', code: 'IC.2', title: 'Consumer Protection Resources', description: 'Consumer advocates, organizations and regulations provide important information and help protect against potential consumer fraud', required: true },
        { id: 'oh-13', code: 'IC.3', title: 'Financial Services Knowledge', description: 'Part of being an informed consumer is knowing how to utilize financial services and risk management tools, as well as comparing consumer lending terms and conditions and reading financial statements', required: true },
        { id: 'oh-14', code: 'IC.4', title: 'Consumer Protection Laws', description: 'Consumer protections laws help safeguard individuals from fraud and potential loss', required: true },
        { id: 'oh-15', code: 'IC.5', title: 'Direct and Indirect Costs', description: 'Planned purchasing decisions factor in direct (price) and indirect costs (e.g. sales/use tax, excise tax, shipping, handling, and delivery charges, etc.)', required: true },
        
        // INVESTING
        { id: 'oh-16', code: 'IN.1', title: 'Investment Principles', description: 'Using key investing principles one can achieve the goal of increasing net worth', required: true },
        { id: 'oh-17', code: 'IN.2', title: 'Investment Strategy Factors', description: 'Investment strategies must take several factors into consideration including time horizon, diversification, risk tolerance, asset allocation, costs, fees, tax implications and time value of money', required: true },
        { id: 'oh-18', code: 'IN.3', title: 'Investment Regulation', description: 'Government agencies are charged with regulating providers of financial services to help protect investors', required: true },
        
        // CREDIT AND DEBT
        { id: 'oh-19', code: 'CD.1', title: 'Credit Fundamentals', description: 'Credit is a contractual agreement in which a borrower receives something of value now and agrees to repay to the lender at some later date', required: true },
        { id: 'oh-20', code: 'CD.2', title: 'Debt Definition', description: 'Debt is an obligation owed by one party to a second party', required: true },
        { id: 'oh-21', code: 'CD.3', title: 'Credit and Debt Balance', description: 'Effectively balancing credit and debt helps one achieve some short and long-term goals', required: true },
        { id: 'oh-22', code: 'CD.4', title: 'Financial Documents', description: 'Financial documents and contractual obligations inform the consumer and define the terms and conditions of establishing credit and incurring debt', required: true },
        { id: 'oh-23', code: 'CD.5', title: 'Post-Secondary Education Payment', description: 'Many options exist for paying for post-secondary education opportunities', required: true },
        
        // RISK MANAGEMENT AND INSURANCE
        { id: 'oh-24', code: 'RM.1', title: 'Risk Management Planning', description: 'A risk management plan can protect consumers from the potential loss of personal and/or business assets or income', required: true },
        { id: 'oh-25', code: 'RM.2', title: 'Identity Protection', description: 'Safeguards exist that help protect ones identity', required: true },
        { id: 'oh-26', code: 'RM.3', title: 'Asset Diversification', description: 'Diversification of assets is one way to manage risk', required: true },
        { id: 'oh-27', code: 'RM.4', title: 'Comprehensive Insurance', description: 'A comprehensive insurance plan (health, life, disability, auto, homeowners, renters, liability, etc.) serves as a safeguard against potential loss', required: true }
      ],
      lessonMappings: [
        // Financial Responsibility
        { lessonId: 0, standardIds: ['oh-1'], required: true, priority: 'high' },
        { lessonId: 62, standardIds: ['oh-1', 'oh-6'], required: true, priority: 'high' },
        { lessonId: 19, standardIds: ['oh-1'], required: true, priority: 'high' },
        { lessonId: 20, standardIds: ['oh-1'], required: true, priority: 'high' },
        { lessonId: 1, standardIds: ['oh-2'], required: true, priority: 'high' },
        { lessonId: 2, standardIds: ['oh-2'], required: true, priority: 'high' },
        { lessonId: 40, standardIds: ['oh-3'], required: true, priority: 'high' },
        { lessonId: 44, standardIds: ['oh-3'], required: true, priority: 'high' },
        { lessonId: 51, standardIds: ['oh-4', 'oh-5'], required: true, priority: 'high' },
        { lessonId: 7, standardIds: ['oh-4'], required: true, priority: 'medium' },
        
        // Planning and Money Management  
        { lessonId: 56, standardIds: ['oh-6'], required: true, priority: 'high' },
        { lessonId: 58, standardIds: ['oh-6'], required: true, priority: 'medium' },
        { lessonId: 59, standardIds: ['oh-6'], required: true, priority: 'medium' },
        { lessonId: 60, standardIds: ['oh-6'], required: true, priority: 'medium' },
        { lessonId: 61, standardIds: ['oh-6'], required: true, priority: 'medium' },
        { lessonId: 3, standardIds: ['oh-7'], required: true, priority: 'high' },
        { lessonId: 4, standardIds: ['oh-7'], required: true, priority: 'high' },
        { lessonId: 6, standardIds: ['oh-7'], required: true, priority: 'medium' },
        { lessonId: 10, standardIds: ['oh-7'], required: true, priority: 'medium' },
        { lessonId: 51, standardIds: ['oh-9'], required: true, priority: 'high' },
        { lessonId: 52, standardIds: ['oh-9'], required: true, priority: 'high' },
        { lessonId: 53, standardIds: ['oh-9'], required: true, priority: 'high' },
        { lessonId: 54, standardIds: ['oh-9'], required: true, priority: 'high' },
        { lessonId: 55, standardIds: ['oh-9'], required: true, priority: 'medium' },
        
        // Informed Consumer
        { lessonId: 65, standardIds: ['oh-11'], required: true, priority: 'medium' },
        { lessonId: 66, standardIds: ['oh-12', 'oh-25'], required: true, priority: 'medium' },
        { lessonId: 67, standardIds: ['oh-12', 'oh-25'], required: true, priority: 'high' },
        { lessonId: 28, standardIds: ['oh-13'], required: true, priority: 'medium' },
        { lessonId: 21, standardIds: ['oh-13'], required: true, priority: 'medium' },
        
        // Investing
        { lessonId: 11, standardIds: ['oh-16'], required: true, priority: 'high' },
        { lessonId: 18, standardIds: ['oh-16'], required: true, priority: 'medium' },
        { lessonId: 13, standardIds: ['oh-17'], required: true, priority: 'high' },
        { lessonId: 14, standardIds: ['oh-17'], required: true, priority: 'medium' },
        { lessonId: 15, standardIds: ['oh-17'], required: true, priority: 'high' },
        { lessonId: 16, standardIds: ['oh-17'], required: true, priority: 'high' },
        { lessonId: 17, standardIds: ['oh-17'], required: true, priority: 'high' },
        { lessonId: 15, standardIds: ['oh-26'], required: true, priority: 'high' },
        { lessonId: 16, standardIds: ['oh-26'], required: true, priority: 'high' },
        
        // Credit and Debt
        { lessonId: 22, standardIds: ['oh-19'], required: true, priority: 'high' },
        { lessonId: 23, standardIds: ['oh-19'], required: true, priority: 'high' },
        { lessonId: 28, standardIds: ['oh-19'], required: true, priority: 'medium' },
        { lessonId: 25, standardIds: ['oh-20'], required: true, priority: 'medium' },
        { lessonId: 29, standardIds: ['oh-20'], required: true, priority: 'medium' },
        { lessonId: 30, standardIds: ['oh-21'], required: true, priority: 'high' },
        { lessonId: 31, standardIds: ['oh-21'], required: true, priority: 'high' },
        { lessonId: 32, standardIds: ['oh-21'], required: true, priority: 'medium' },
        { lessonId: 24, standardIds: ['oh-21'], required: true, priority: 'high' },
        { lessonId: 25, standardIds: ['oh-22'], required: true, priority: 'medium' },
        { lessonId: 26, standardIds: ['oh-22'], required: true, priority: 'high' },
        { lessonId: 27, standardIds: ['oh-22'], required: true, priority: 'high' },
        { lessonId: 35, standardIds: ['oh-23'], required: true, priority: 'medium' },
        { lessonId: 36, standardIds: ['oh-23'], required: true, priority: 'medium' },
        { lessonId: 37, standardIds: ['oh-23'], required: true, priority: 'high' },
        
        // Risk Management and Insurance
        { lessonId: 45, standardIds: ['oh-24'], required: true, priority: 'high' },
        { lessonId: 46, standardIds: ['oh-24', 'oh-27'], required: true, priority: 'high' },
        { lessonId: 47, standardIds: ['oh-24', 'oh-27'], required: true, priority: 'medium' },
        { lessonId: 48, standardIds: ['oh-27'], required: true, priority: 'medium' },
        { lessonId: 49, standardIds: ['oh-27'], required: true, priority: 'medium' },
        { lessonId: 50, standardIds: ['oh-27'], required: true, priority: 'medium' }
      ]
    }
  ];

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

  const [selectedState, setSelectedState] = useState<string>('ALL');
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

  // Helper functions for state standards
  const getCurrentState = (): State => {
    return statesData.find(state => state.code === selectedState) || statesData[0];
  };

  const getLessonStateMapping = (lessonId: number): StateLessonMapping | null => {
    const currentState = getCurrentState();
    return currentState.lessonMappings.find(mapping => mapping.lessonId === lessonId) || null;
  };

  const getLessonStandards = (lessonId: number): StateStandard[] => {
    const mapping = getLessonStateMapping(lessonId);
    if (!mapping) return [];
    
    const currentState = getCurrentState();
    return mapping.standardIds.map(standardId => 
      currentState.standards.find(standard => standard.id === standardId)
    ).filter(Boolean) as StateStandard[];
  };

  const isLessonRequiredByState = (lessonId: number): boolean => {
    const mapping = getLessonStateMapping(lessonId);
    return mapping ? mapping.required : false;
  };

  const isLessonNotRequiredByState = (lessonId: number): boolean => {
    if (selectedState !== 'OH') return false;
    
    // Ohio lessons that are NOT required according to the summary
    const ohioNotRequiredLessons = [5, 8, 12, 33, 34, 39, 63, 64]; // Beware of Banking Fees, Challenges to Saving, What is the Stock Market?, Paying for College 101, Applying for the FAFSA, Time for Payback, Your Money & Social Media, Advertisements & Dark Patterns
    return ohioNotRequiredLessons.includes(lessonId);
  };

  const getStandardsNotAddressed = (): StateStandard[] => {
    if (selectedState !== 'OH') return [];
    
    // Ohio standard not addressed by NGPF curriculum
    return [{
      id: 'oh-8',
      code: 'Standard 8',
      title: 'Financial Expert Guidance',
      description: 'Financial experts provide guidance and advice on a wide variety of financial issues',
      required: true
    }];
  };

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

  // Update lesson settings when state changes
  useEffect(() => {
    if (selectedState !== 'ALL') {
      const currentState = getCurrentState();
      const newLessonSettings = { ...lessonSettings };
      
      // Apply state-specific requirements
      allLessons.forEach(lesson => {
        const mapping = currentState.lessonMappings.find(m => m.lessonId === lesson.id);
        if (mapping) {
          // If lesson has state mapping, enable it and set based on state requirements
          newLessonSettings[lesson.id] = {
            ...newLessonSettings[lesson.id],
            lessonEnabled: true,
            canToggleActivities: !mapping.required && lesson.required === "No"
          };
        }
      });
      
      setLessonSettings(newLessonSettings);
    }
  }, [selectedState]);

  useEffect(() => {
    setResults(generatePacingPlan());
  }, [settings, lessonSettings, combinedLessons, selectedState]);

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

  // CORRECT Priority Optimization: Activities → Combinations → Lessons  
  const optimizePacingGuide = () => {
    const timeConstraints = calculateAvailableTime();
    const effectiveClassTime = timeConstraints.effectiveMinutesPerClass;
    const availableDays = timeConstraints.availableTeachingDays;

    console.log(`CORRECT PRIORITY OPTIMIZATION: ${availableDays} days available`);

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

    // STEP 3: FIRST PRIORITY - Turn off optional activities one by one
    while (currentPeriods > availableDays) {
      const optionalWithActivities = allLessons.filter(lesson => 
        lesson.required === "No" && 
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

    // STEP 4: SECOND PRIORITY - Remove optional lessons if still needed
    while (currentPeriods > availableDays) {
      const optionalLessons = allLessons.filter(lesson => 
        lesson.required === "No" && newLessonSettings[lesson.id].lessonEnabled
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
          Lesson-by-Lesson Pacing Guide
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Plan your semester by checking lessons to include and combining related lessons for optimal time management
        </p>
      </div>

      {/* State Selection */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Your State:
            </label>
          </div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {statesData.map(state => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
          
          {selectedState !== 'ALL' && (
            <div className="flex items-center gap-2 ml-4 text-sm text-blue-600 dark:text-blue-400">
              <Award size={16} />
              <span>
                {getCurrentState().standards.filter(s => s.required).length} required standards,
                {getCurrentState().standards.filter(s => !s.required).length} optional
              </span>
            </div>
          )}
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

      {/* Standards Coverage Dashboard */}
      {selectedState !== 'ALL' && results?.lessons && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Award className="text-blue-600 dark:text-blue-400" size={24} />
            {getCurrentState().name} Standards Coverage
          </h3>
          
          {(() => {
            const currentState = getCurrentState();
            const enabledLessons = results.lessons.filter(lesson => lesson.lessonEnabled);
            const coveredStandardIds = new Set();
            
            enabledLessons.forEach(lesson => {
              const standards = getLessonStandards(lesson.id);
              standards.forEach(standard => coveredStandardIds.add(standard.id));
            });
            
            const coveredStandards = currentState.standards.filter(s => coveredStandardIds.has(s.id));
            const missingStandards = currentState.standards.filter(s => !coveredStandardIds.has(s.id));
            const coveragePercentage = Math.round((coveredStandards.length / currentState.standards.length) * 100);
            
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {coveragePercentage}%
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">Standards Coverage</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {coveredStandards.length} of {currentState.standards.length} standards
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {coveredStandards.filter(s => s.required).length}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Required Standards Met</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      of {currentState.standards.filter(s => s.required).length} required
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {missingStandards.filter(s => s.required).length}
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-400">Missing Required</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Standards not covered
                    </div>
                  </div>
                </div>
                
                {missingStandards.filter(s => s.required).length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                      <AlertTriangle size={16} />
                      Missing Required Standards
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {missingStandards.filter(s => s.required).map(standard => (
                        <div key={standard.id} className="flex items-center gap-2 text-xs">
                          <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                            {standard.code}
                          </span>
                          <span className="text-red-700 dark:text-red-300">
                            {standard.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Covered Standards ({coveredStandards.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {coveredStandards.map(standard => (
                      <div key={standard.id} className="flex items-center gap-2 text-xs">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          standard.required 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                        }`}>
                          {standard.code}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 truncate">
                          {standard.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedState === 'OH' && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                      <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Standards NOT Addressed by NGPF Curriculum
                      </h4>
                      <p className="text-xs text-orange-700 dark:text-orange-300 mb-2">
                        You will need additional resources to meet the following standards:
                      </p>
                      {getStandardsNotAddressed().map(standard => (
                        <div key={standard.id} className="flex items-center gap-2 text-xs">
                          <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200">
                            {standard.code}
                          </span>
                          <span className="text-orange-700 dark:text-orange-300">
                            {standard.description}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                      <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Lessons NOT Required by Ohio Standards
                      </h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                        These lessons may be included or removed for pacing purposes:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {allLessons.filter(lesson => isLessonNotRequiredByState(lesson.id)).map(lesson => (
                          <div key={lesson.id} className="text-xs text-blue-700 dark:text-blue-300">
                            • {lesson.name}
                          </div>
                        ))}
                      </div>
                    </div>
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
                      {selectedState !== 'ALL' && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Standards</th>
                      )}
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
                            {selectedState !== 'ALL' && (
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  {getLessonStandards(lesson.id).map(standard => (
                                    <div key={standard.id} className="text-xs">
                                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                        standard.required 
                                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                      }`}>
                                        {standard.code}
                                      </span>
                                    </div>
                                  ))}
                                  {getLessonStandards(partner.id).map(standard => (
                                    <div key={standard.id} className="text-xs">
                                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                        standard.required 
                                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                      }`}>
                                        {standard.code}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            )}
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
                              lesson.required === 'Yes' || isLessonRequiredByState(lesson.id) 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' 
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                            } ${lesson.lessonEnabled === false ? 'opacity-50' : ''}`}>
                              {lesson.required === 'Yes' || isLessonRequiredByState(lesson.id) ? 'Required Activity' : 'Optional Activity'}
                            </span>
                            {isLessonRequiredByState(lesson.id) && lesson.required === 'No' && (
                              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Required by {getCurrentState().name}
                              </div>
                            )}
                            {isLessonNotRequiredByState(lesson.id) && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Not required by {getCurrentState().name}
                              </div>
                            )}
                          </td>
                          {selectedState !== 'ALL' && (
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                {getLessonStandards(lesson.id).map(standard => (
                                  <div key={standard.id} className="text-xs">
                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                      standard.required 
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                    }`}>
                                      {standard.code}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400 ml-1" title={standard.description}>
                                      {standard.title}
                                    </span>
                                  </div>
                                ))}
                                {getLessonStandards(lesson.id).length === 0 && (
                                  <div className="text-xs text-gray-400 dark:text-gray-500">
                                    No standards mapped
                                  </div>
                                )}
                              </div>
                            </td>
                          )}
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