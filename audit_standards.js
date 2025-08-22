// COMPREHENSIVE STANDARDS AUDIT SCRIPT
// This script verifies all lesson mappings against the NGPF Crosswalk Document

// Expected mappings from the crosswalk document
const CROSSWALK_MAPPINGS = {
  // EARNING INCOME 12.1
  "Finding a Job": ["ei-12.1", "ei-12.2"],
  "Starting a New Job": ["ei-12.1", "ei-12.2", "ei-12.9"],
  "How to Invest for Retirement": ["ei-12.1", "ei-12.10", "sv-12.6", "sv-12.7", "in-12.8"],
  "How Health Insurance Works": ["ei-12.1", "mr-12.1", "mr-12.5", "sv-12.7"],
  "How to Access Health Insurance": ["ei-12.1", "mr-12.2", "mr-12.5", "mr-12.9", "sv-12.5"],

  // EARNING INCOME 12.3
  "Career Exploration": ["ei-12.3", "ei-12.4"],
  "Paying for College 101": ["ei-12.3", "mc-12.4"],

  // EARNING INCOME 12.5
  "Being Unbanked": ["ei-12.5", "mc-12.13"],

  // EARNING INCOME 12.6
  "Time to File": ["ei-12.6"],
  "How to File Your Taxes": ["ei-12.6", "ei-12.7", "ei-12.8"],
  "Taxes and Your Paystub": ["ei-12.6", "ei-12.7"],
  "The Importance of Investing for Retirement": ["ei-12.6", "ei-12.10", "sp-12.1"],

  // EARNING INCOME 12.7
  "Budgeting Basics": ["ei-12.7"],

  // EARNING INCOME 12.8
  "Teens and Taxes": ["ei-12.8", "ei-12.11"],

  // EARNING INCOME 12.9
  "The Tax Cycle and Job Paperwork": ["ei-12.9"], // Missing from current mappings

  // SPENDING 12.1
  "Strategies to Save": ["sp-12.1", "sv-12.9"],
  "Budgeting Strategies": ["sp-12.1"],
  "Budgeting for Housing": ["sp-12.1", "sp-12.6"],
  "Budgeting for Food": ["sp-12.1", "sp-12.2", "sp-12.4", "in-12.4"],
  "Build Your Budget": ["sp-12.1", "sp-12.9"],
  "Budgeting for Transportation": ["sp-12.1", "sp-12.2"],

  // SPENDING 12.2
  "Financial Aid Packages": ["sp-12.2"],
  "Your Money & Social Media": ["sp-12.2", "sp-12.5", "sv-12.8", "sv-12.9"],
  "Advertisements & Dark Patterns": ["sp-12.2", "sp-12.5"],
  "Comparison Shopping": ["sp-12.2", "sp-12.3", "sp-12.5"],

  // SPENDING 12.3
  "Beware of Banking Fees": ["sp-12.3", "sv-12.2"],

  // SPENDING 12.8
  "Identity Theft": ["sp-12.8", "mr-12.11"],
  "Scams & Fraud": ["sp-12.8", "mr-12.11"],

  // SPENDING 12.9
  "Online and Mobile Banking": ["sp-12.9", "sv-12.3"],

  // SAVING 12.1
  "Savings Accounts": ["sv-12.1", "sv-12.2"],

  // SAVING 12.3
  "Digital Wallets & P2P Apps": ["sv-12.3"],

  // SAVING 12.4
  "Challenges to Saving": ["sv-12.4", "sv-12.9"],

  // SAVING 12.5
  "Checking Accounts": ["sv-12.5", "mc-12.13"],
  "Auto Insurance": ["sv-12.5", "mr-12.3", "mr-12.4", "mr-12.7"],

  // SAVING 12.6
  "Start Investing": ["sv-12.6", "in-12.1", "in-12.6", "in-12.9", "in-12.10", "in-12.11"],

  // SAVING 12.8
  // Already covered in Your Money & Social Media

  // SAVING 12.9
  "Your Values and Money": ["sv-12.9"],

  // INVESTING 12.1
  "Why Should I Invest?": ["in-12.1", "in-12.2", "in-12.3", "in-12.4", "in-12.6"],
  "Managing Risk": ["in-12.1", "in-12.3", "in-12.6"],

  // INVESTING 12.2
  "What is the Stock Market?": ["in-12.2", "in-12.5", "in-12.13"],
  "What is a Stock?": ["in-12.2", "in-12.3", "in-12.5"],
  "What is a Bond?": ["in-12.2", "in-12.3", "in-12.5"],

  // INVESTING 12.6
  "Investing in Funds": ["in-12.6", "in-12.13"],

  // INVESTING 12.7
  "Deep Dive into Funds": ["in-12.6", "in-12.7", "in-12.13"],

  // INVESTING 12.9
  "Your Brain and Money": ["in-12.9"],
  "Overcoming Cognitive Biases": ["in-12.9"],

  // INVESTING 12.10
  "Modern Investing": ["in-12.10", "in-12.11"],

  // MANAGING CREDIT 12.1
  "Intro to Credit": ["mc-12.1", "mc-12.2", "mc-12.6"],
  "Young People & Credit Cards": ["mc-12.1", "mc-12.8", "mc-12.12"],
  "Using Credit Cards Wisely": ["mc-12.1", "mc-12.10"],
  "Loan Fundamentals": ["mc-12.1", "mc-12.13"],
  "Auto Loans": ["mc-12.1", "mc-12.2", "mc-12.6", "sp-12.3"],
  "Predatory Lending": ["mc-12.1", "mc-12.10", "mc-12.13"],

  // MANAGING CREDIT 12.2
  "Mortgages": ["mc-12.2", "mc-12.3", "mc-12.6"],

  // MANAGING CREDIT 12.3
  "Building Credit from Scratch": ["mc-12.3", "mc-12.8", "mc-12.9"],

  // MANAGING CREDIT 12.4
  "Applying for the FAFSA": ["mc-12.4", "mc-12.5"],
  "Scholarships and Grants": ["mc-12.4"],
  "Student Loans": ["mc-12.4", "mc-12.5"],

  // MANAGING CREDIT 12.5
  "Student Loan Repayment": ["mc-12.5"],
  "Time for Payback": ["mc-12.5"],

  // MANAGING CREDIT 12.7
  "Your Credit Report": ["mc-12.7", "mc-12.9"],

  // MANAGING CREDIT 12.8
  "Your Credit Score": ["mc-12.8", "mc-12.9"],

  // MANAGING CREDIT 12.10
  "Debt Management": ["mc-12.10"],

  // MANAGING RISK 12.1
  "Intro to Insurance": ["mr-12.1", "mr-12.12"],
  "Other Types of Insurance": ["mr-12.1", "mr-12.2", "mr-12.8"],

  // MANAGING RISK 12.2
  "Renters & Homeowners Insurance": ["mr-12.2", "mr-12.3", "mr-12.7"],

  // Missing lessons that should be mapped:
  "The Tax Cycle and Job Paperwork": ["ei-12.9"], // Missing from current code
  "Resumes and Cover Letters": [], // Not in standards (summary section)
  "The Interview": [], // Not in standards (summary section)
};

// Current mappings from the code (to be checked)
const CURRENT_MAPPINGS = {
  40: ["ei-12.3", "ei-12.4"], // Career Exploration
  41: ["ei-12.1", "ei-12.2"], // Finding a Job
  44: ["ei-12.1", "ei-12.2", "ei-12.9"], // Starting a New Job
  19: ["ei-12.6", "ei-12.10", "sp-12.1"], // The Importance of Investing for Retirement
  20: ["ei-12.1", "ei-12.10", "sv-12.6", "sv-12.7", "in-12.8"], // How to Invest for Retirement
  48: ["ei-12.1", "mr-12.1", "mr-12.5", "sv-12.7"], // How Health Insurance Works
  49: ["ei-12.1", "mr-12.2", "mr-12.5", "mr-12.9", "sv-12.5"], // How to Access Health Insurance
  55: ["ei-12.6"], // Time to File
  54: ["ei-12.6", "ei-12.7", "ei-12.8"], // How to File Your Taxes
  51: ["ei-12.6", "ei-12.7"], // Taxes and Your Paystub
  53: ["ei-12.8", "ei-12.11"], // Teens and Taxes

  7: ["sp-12.1", "sv-12.9"], // Strategies to Save
  56: ["ei-12.7"], // Budgeting Basics
  58: ["sp-12.1"], // Budgeting Strategies
  59: ["sp-12.1", "sp-12.6"], // Budgeting for Housing
  62: ["sp-12.1", "sp-12.9"], // Build Your Budget
  60: ["sp-12.1", "sp-12.2"], // Budgeting for Transportation
  61: ["sp-12.1", "sp-12.2", "sp-12.4", "in-12.4"], // Budgeting for Food
  37: ["sp-12.2"], // Financial Aid Packages
  63: ["sp-12.2", "sp-12.5", "sv-12.8", "sv-12.9"], // Your Money & Social Media
  64: ["sp-12.2", "sp-12.5"], // Advertisements & Dark Patterns
  65: ["sp-12.2", "sp-12.3", "sp-12.5"], // Comparison Shopping
  10: ["sp-12.9", "sv-12.3"], // Online and Mobile Banking

  4: ["sv-12.1", "sv-12.2"], // Savings Accounts
  5: ["sp-12.3", "sv-12.2"], // Beware of Banking Fees
  3: ["sv-12.5", "mc-12.13"], // Checking Accounts
  9: ["sv-12.3"], // Digital Wallets & P2P Apps
  8: ["sv-12.4", "sv-12.9"], // Challenges to Saving
  0: ["sv-12.9"], // Your Values and Money

  11: ["in-12.1", "in-12.2", "in-12.3", "in-12.4", "in-12.6"], // Why Should I Invest?
  12: ["in-12.2", "in-12.5", "in-12.13"], // What is the Stock Market?
  13: ["in-12.2", "in-12.3", "in-12.5"], // What is a Stock?
  14: ["in-12.2", "in-12.3", "in-12.5"], // What is a Bond?
  15: ["in-12.1", "in-12.3", "in-12.6"], // Managing Risk
  16: ["in-12.6", "in-12.13"], // Investing in Funds
  17: ["in-12.6", "in-12.7", "in-12.13"], // Deep Dive into Funds
  18: ["sv-12.6", "in-12.1", "in-12.6", "in-12.9", "in-12.10", "in-12.11"], // Start Investing
  21: ["in-12.10", "in-12.11"], // Modern Investing
  1: ["in-12.9"], // Your Brain and Money
  2: ["in-12.9"], // Overcoming Cognitive Biases

  22: ["mc-12.1", "mc-12.2", "mc-12.6"], // Intro to Credit
  23: ["mc-12.1", "mc-12.8", "mc-12.12"], // Young People & Credit Cards
  24: ["mc-12.1", "mc-12.10"], // Using Credit Cards Wisely
  25: ["mc-12.1", "mc-12.13"], // Loan Fundamentals
  26: ["mc-12.1", "mc-12.2", "mc-12.6", "sp-12.3"], // Auto Loans
  27: ["mc-12.2", "mc-12.3", "mc-12.6"], // Mortgages
  28: ["mc-12.1", "mc-12.10", "mc-12.13"], // Predatory Lending
  29: ["mc-12.10"], // Debt Management
  30: ["mc-12.7", "mc-12.9"], // Your Credit Report
  31: ["mc-12.8", "mc-12.9"], // Your Credit Score
  32: ["mc-12.3", "mc-12.8", "mc-12.9"], // Building Credit from Scratch
  33: ["ei-12.3", "mc-12.4"], // Paying for College 101
  34: ["mc-12.4", "mc-12.5"], // Applying for the FAFSA
  35: ["mc-12.4"], // Scholarships and Grants
  36: ["mc-12.4", "mc-12.5"], // Student Loans
  38: ["mc-12.5"], // Student Loan Repayment
  39: ["mc-12.5"], // Time for Payback

  45: ["mr-12.1", "mr-12.12"], // Intro to Insurance
  46: ["sv-12.5", "mr-12.3", "mr-12.4", "mr-12.7"], // Auto Insurance
  47: ["mr-12.2", "mr-12.3", "mr-12.7"], // Renters & Homeowners Insurance
  50: ["mr-12.1", "mr-12.2", "mr-12.8"], // Other Types of Insurance
  66: ["sp-12.8", "mr-12.11"], // Identity Theft
  67: ["sp-12.8", "mr-12.11"], // Scams & Fraud

  // Add missing lessons
  6: ["ei-12.5", "mc-12.13"], // Being Unbanked
  52: ["ei-12.9"] // The Tax Cycle and Job Paperwork
};

// Lesson ID to Name mapping
const LESSON_NAMES = {
  0: "Your Values and Money",
  1: "Your Brain and Money", 
  2: "Overcoming Cognitive Biases",
  3: "Checking Accounts",
  4: "Savings Accounts",
  5: "Beware of Banking Fees",
  6: "Being Unbanked",
  7: "Strategies to Save",
  8: "Challenges to Saving",
  9: "Digital Wallets & P2P Apps",
  10: "Online and Mobile Banking",
  11: "Why Should I Invest?",
  12: "What is the Stock Market?",
  13: "What is a Stock?",
  14: "What is a Bond?",
  15: "Managing Risk",
  16: "Investing in Funds",
  17: "Deep Dive into Funds",
  18: "Start Investing",
  19: "The Importance of Investing for Retirement",
  20: "How to Invest for Retirement",
  21: "Modern Investing",
  22: "Intro to Credit",
  23: "Young People & Credit Cards",
  24: "Using Credit Cards Wisely",
  25: "Loan Fundamentals",
  26: "Auto Loans",
  27: "Mortgages",
  28: "Predatory Lending",
  29: "Debt Management",
  30: "Your Credit Report",
  31: "Your Credit Score",
  32: "Building Credit from Scratch",
  33: "Paying for College 101",
  34: "Applying for the FAFSA",
  35: "Scholarships and Grants",
  36: "Student Loans",
  37: "Financial Aid Packages",
  38: "Student Loan Repayment",
  39: "Time for Payback",
  40: "Career Exploration",
  41: "Finding a Job",
  44: "Starting a New Job",
  45: "Intro to Insurance",
  46: "Auto Insurance",
  47: "Renters & Homeowners Insurance",
  48: "How Health Insurance Works",
  49: "How to Access Health Insurance",
  50: "Other Types of Insurance",
  51: "Taxes and Your Paystub",
  52: "The Tax Cycle and Job Paperwork",
  53: "Teens and Taxes",
  54: "How to File Your Taxes",
  55: "Time to File",
  56: "Budgeting Basics",
  58: "Budgeting Strategies",
  59: "Budgeting for Housing",
  60: "Budgeting for Transportation",
  61: "Budgeting for Food",
  62: "Build Your Budget",
  63: "Your Money & Social Media",
  64: "Advertisements & Dark Patterns",
  65: "Comparison Shopping",
  66: "Identity Theft",
  67: "Scams & Fraud"
};

function auditMappings() {
  console.log("🔍 COMPREHENSIVE STANDARDS AUDIT");
  console.log("================================");
  
  let errors = [];
  let warnings = [];
  let successes = [];

  // Check each current mapping against expected
  for (const [lessonId, currentStandards] of Object.entries(CURRENT_MAPPINGS)) {
    const lessonName = LESSON_NAMES[lessonId];
    const expectedStandards = CROSSWALK_MAPPINGS[lessonName];
    
    if (!expectedStandards) {
      warnings.push(`⚠️  ${lessonName} (ID: ${lessonId}) - No expected mapping found in crosswalk`);
      continue;
    }

    // Sort both arrays for comparison
    const currentSorted = [...currentStandards].sort();
    const expectedSorted = [...expectedStandards].sort();
    
    if (JSON.stringify(currentSorted) === JSON.stringify(expectedSorted)) {
      successes.push(`✅ ${lessonName} - CORRECT`);
    } else {
      errors.push({
        lesson: lessonName,
        lessonId,
        current: currentStandards,
        expected: expectedStandards,
        missing: expectedStandards.filter(s => !currentStandards.includes(s)),
        extra: currentStandards.filter(s => !expectedStandards.includes(s))
      });
    }
  }

  // Check for lessons in crosswalk but missing from current mappings
  for (const [lessonName, expectedStandards] of Object.entries(CROSSWALK_MAPPINGS)) {
    if (expectedStandards.length === 0) continue; // Skip lessons not in standards
    
    const lessonId = Object.keys(LESSON_NAMES).find(id => LESSON_NAMES[id] === lessonName);
    if (!lessonId || !CURRENT_MAPPINGS[lessonId]) {
      warnings.push(`⚠️  ${lessonName} - Expected in crosswalk but missing from current mappings`);
    }
  }

  // Print results
  console.log(`\n✅ CORRECT MAPPINGS (${successes.length}):`);
  successes.forEach(s => console.log(s));

  console.log(`\n❌ INCORRECT MAPPINGS (${errors.length}):`);
  errors.forEach(error => {
    console.log(`\n❌ ${error.lesson} (ID: ${error.lessonId})`);
    console.log(`   Current:  [${error.current.join(', ')}]`);
    console.log(`   Expected: [${error.expected.join(', ')}]`);
    if (error.missing.length > 0) {
      console.log(`   Missing:  [${error.missing.join(', ')}]`);
    }
    if (error.extra.length > 0) {
      console.log(`   Extra:    [${error.extra.join(', ')}]`);
    }
  });

  console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
  warnings.forEach(w => console.log(w));

  console.log(`\n📊 SUMMARY:`);
  console.log(`   ✅ Correct: ${successes.length}`);
  console.log(`   ❌ Errors:  ${errors.length}`);
  console.log(`   ⚠️  Warnings: ${warnings.length}`);
  console.log(`   📈 Accuracy: ${Math.round((successes.length / (successes.length + errors.length)) * 100)}%`);

  return { errors, warnings, successes };
}

// Run the audit
auditMappings(); 