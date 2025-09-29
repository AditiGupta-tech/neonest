import { NextResponse } from 'next/server';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDummyData() {
  // Simulate last feed time
  const lastFeed = Date.now() - getRandomInt(1, 3) * 60 * 60 * 1000;
  const nextFeedTime = `${getRandomInt(1, 3)}h ${getRandomInt(0, 59)}m`;
  const feedingConfidence = getRandomInt(80, 99);

  // Simulate sleep
  const nextNapTime = `${getRandomInt(0, 2)}h ${getRandomInt(0, 59)}m`;
  const bedtimeWindow = `${getRandomInt(7, 9)}:00pm - ${getRandomInt(9, 10)}:00pm`;
  const sleepConfidence = getRandomInt(75, 98);

  // Simulate growth
  const percentile = `${getRandomInt(10, 95)}th`;
  const tips = [
    'Offer a variety of foods.',
    'Track weight monthly.',
    'Consult pediatrician for concerns.',
    'Encourage tummy time.',
  ];
  const growthConfidence = getRandomInt(70, 97);

  // Simulate recommendation
  const messages = [
    'Try a gentle lullaby now.',
    'Offer a small feed if fussy.',
    'Check diaper before nap.',
    'Play soft music for sleep.',
    'Give baby tummy time.',
  ];
  const recommendationConfidence = getRandomInt(80, 99);

  return {
    feeding: {
      nextFeedTime,
      confidence: feedingConfidence,
    },
    sleep: {
      nextNapTime,
      bedtimeWindow,
      confidence: sleepConfidence,
    },
    growth: {
      percentile,
      tips: tips[getRandomInt(0, tips.length - 1)],
      confidence: growthConfidence,
    },
    recommendation: {
      message: messages[getRandomInt(0, messages.length - 1)],
      confidence: recommendationConfidence,
    },
  };
}

export async function GET() {
  const data = getDummyData();
  return NextResponse.json(data);
}
