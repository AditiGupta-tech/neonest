// Demo data generator for dashboard widgets
// This provides realistic sample data when user has no actual data

export const generateDemoFeedingData = () => {
  const feedingTypes = ["Breastfeeding", "Bottle", "Solid Food"];
  const demoData = [];
  
  // Generate data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random number of feedings per day (6-12)
    const feedingsPerDay = Math.floor(Math.random() * 7) + 6;
    
    for (let j = 0; j < feedingsPerDay; j++) {
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const feedTime = new Date(date);
      feedTime.setHours(hour, minute, 0, 0);
      
      // Weight distribution: more breastfeeding for newborns
      const rand = Math.random();
      let type;
      if (rand < 0.5) type = "Breastfeeding";
      else if (rand < 0.8) type = "Bottle";
      else type = "Solid Food";
      
      demoData.push({
        type: type,
        amount: type === "Breastfeeding" ? "Both sides" : `${Math.floor(Math.random() * 150) + 50}ml`,
        time: feedTime.toISOString(),
        createdAt: feedTime.toISOString(),
        notes: "Demo feeding data"
      });
    }
  }
  
  return demoData;
};

export const generateDemoSleepData = () => {
  const sleepTypes = ["nap", "night"];
  const demoData = [];
  
  // Generate data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Night sleep (1-2 sessions)
    const nightSessions = Math.random() > 0.3 ? 1 : 2;
    for (let j = 0; j < nightSessions; j++) {
      const hours = Math.floor(Math.random() * 4) + 6; // 6-10 hours
      const mins = Math.floor(Math.random() * 60);
      demoData.push({
        date: dateStr,
        time: `${20 + j * 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        duration: `${hours} hr ${mins} min`,
        type: "night",
        quality: ["Good", "Excellent", "Fair"][Math.floor(Math.random() * 3)]
      });
    }
    
    // Naps (2-4 per day)
    const napCount = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < napCount; j++) {
      const hours = Math.floor(Math.random() * 2) + 1; // 1-3 hours
      const mins = Math.floor(Math.random() * 60);
      demoData.push({
        date: dateStr,
        time: `${9 + j * 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        duration: `${hours} hr ${mins} min`,
        type: "nap",
        quality: ["Good", "Fair"][Math.floor(Math.random() * 2)]
      });
    }
  }
  
  return demoData;
};

export const generateDemoGrowthData = () => {
  const demoData = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6); // Start 6 months ago
  
  let currentHeight = 50; // Starting height in cm
  let currentWeight = 3.5; // Starting weight in kg
  
  // Generate bi-weekly measurements
  for (let i = 0; i < 13; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 14)); // Every 2 weeks
    
    // Realistic growth patterns
    currentHeight += Math.random() * 1.5 + 0.5; // 0.5-2 cm growth
    currentWeight += Math.random() * 0.3 + 0.2; // 0.2-0.5 kg growth
    
    demoData.push({
      date: date.toISOString().split('T')[0],
      height: parseFloat(currentHeight.toFixed(1)),
      weight: parseFloat(currentWeight.toFixed(2)),
      headCircumference: parseFloat((35 + i * 0.5).toFixed(1))
    });
  }
  
  return demoData;
};

export const generateDemoMemories = () => {
  return [
    {
      title: "First Smile",
      description: "Baby smiled for the first time!",
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      image: "/happyBaby.png"
    },
    {
      title: "First Steps",
      description: "Took first steps today!",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      image: "/happyBaby.png"
    },
    {
      title: "First Words",
      description: "Said 'mama' for the first time",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      image: "/happyBaby.png"
    }
  ];
};

export const generateDemoMilestones = () => {
  return {
    "smile": true,
    "rollOver": true,
    "sitUp": true,
    "crawl": true,
    "stand": true,
    "walk": false,
    "talk": false,
    "wave": true,
    "clap": true
  };
};

// Check if user has actual data
export const hasActualData = (data) => {
  return data && data.length > 0;
};

// Mix demo data with actual data if needed
export const enrichWithDemoData = (actualData, demoData, minRequired = 5) => {
  if (actualData.length >= minRequired) {
    return actualData;
  }
  
  // Combine actual data with demo data
  const combined = [...actualData];
  const needed = minRequired - actualData.length;
  
  // Add demo data to fill the gap
  for (let i = 0; i < needed && i < demoData.length; i++) {
    combined.push({ ...demoData[i], isDemo: true });
  }
  
  return combined;
};
