import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load .env
dotenv.config();

const stories = [
  "I lost my job during the recession and felt like a complete failure. I started volunteering at a local shelter just to have a reason to leave the house. There, I realized my worth wasn't tied to my paycheck, but to my capacity to help others. I eventually found a new career path that is much more fulfilling.",
  "When my partner of 12 years left, I thought my life was over. I spent months in isolation. One day, I decided to take a solo trip to the mountains. The silence taught me that I am enough on my own. Happiness is an internal state, not a dependency on someone else.",
  "I struggled with chronic pain for years and felt abandoned by medicine. I started journaling my small wins every day—even if it was just making a cup of tea. It shifted my focus from what I couldn't do to what I could. My pain is still there, but it no longer defines my identity.",
  "In my early 20s, I was obsessed with social media perfection. It led to severe anxiety. I did a 30-day digital detox and rediscovered my love for analog photography. Seeing the world through a lens without the pressure to 'post' saved my mental health.",
  "I was a straight-A student who had a breakdown in grad school. I realized I was living my parents' dream, not mine. I dropped out, became a carpenter, and for the first time in my life, I feel at peace with my hands and my heart.",
  "Moving to a new country where I didn't speak the language was the loneliest time of my life. I started bringing extra food to the park and sharing it with regulars. Food became our universal language, and I found a chosen family in the most unexpected place.",
  "I survived a house fire and lost everything I owned. I spent weeks grieving the 'things'. But then I noticed the community of neighbors who brought me clothes and kindness. I learned that home isn't a building; it's the people who show up when the walls fall down.",
  "I spent a decade in a high-stress corporate job that made me physically ill. I finally quit with no plan. I spent a year just resting and learning to garden. The patience required to grow a plant taught me the patience I needed to heal myself.",
  "My child was diagnosed with a severe learning disability, and I felt so much guilt and fear. Through the struggle, I learned that 'different' isn't 'less'. My child's unique way of seeing the world has made me a more empathetic and creative human.",
  "I was always the 'strong friend' who never asked for help. When I hit rock bottom, I finally reached out. The vulnerability I showed actually deepened my friendships rather than burdening them. Strength isn't carrying it all alone; it's knowing when to share the weight.",
  "I failed my bar exam three times. Each time felt like a deeper hole. On the fourth try, I passed. The delay wasn't a denial; it was a period of character building that made me a much more resilient and humble lawyer.",
  "I grew up in poverty and felt a lot of shame about my background. As I became successful, I tried to hide it. I eventually realized that my upbringing gave me a gritty resourcefulness that my peers lack. My history is my superpower, not my secret.",
  "Dealing with my mother's dementia was a slow grieving process. I learned to stop trying to bring her back to my reality and instead join her in hers. We found moments of joy in the simplest reflections and songs. Love doesn't require memory.",
  "I had a debilitating fear of public speaking that held my career back for years. I joined a local theater group just to face it. Standing on a stage in a costume made the corporate boardroom feel small and manageable. Fear is just energy waiting for a direction.",
  "I was a perfectionist athlete who suffered a career-ending injury. I had to redefine who I was without my physical prowess. I discovered a passion for teaching and coaching, realizing that my value lies in my experience, not just my execution.",
  "I spent years in an echo chamber of my own opinions. Traveling to a place with vastly different values challenged everything I thought I knew. I learned that being right is much less interesting than being open.",
  "I struggled with infertility for years and it felt like a personal failure. Through the process of adoption, I learned that family is built of choice and commitment, not just biology. My heart grew in ways I never imagined possible.",
  "I was a workaholic who missed my children's early years. A health scare forced me to slow down. I started a tradition of 'no-phone Fridays' where we just exist together. I can't get back the lost years, but I am making sure the future ones are full.",
  "I was paralyzed by the climate crisis and felt hopeless. I started a community composting project in my apartment complex. Seeing small, local changes scale up gave me the agency to face the bigger picture with determination instead of despair.",
  "I lost my twin brother and felt like half of me was missing. I started writing letters to him every day. Eventually, the letters became a book that helped other grieving siblings. My pain found a purpose, and he lives on through the comfort I give others.",
  "I was deep in debt and felt a constant weight on my chest. I decided to be radical and transparent about it with my friends. Their non-judgmental support helped me stay on a strict budget. Financial health started with emotional honesty.",
  "I spent years trying to please a difficult manager who never gave me validation. I finally realized that no amount of effort would change their nature. I moved to a team where I am valued, and my productivity—and happiness—skyrocketed.",
  "I was an artist who stopped creating because I was afraid of being 'bad'. I started a '100 days of ugly art' challenge where the goal was to make something messy. It broke the spell of perfectionism and brought back the joy of play.",
  "I lived with social anxiety that made even going to the grocery store a nightmare. I adopted a rescue dog who required daily walks. Focusing on his needs in public distracted me from my own self-consciousness. He saved me by needing me.",
  "I was a scientist who felt pressured to always have the answers. A failed experiment taught me that 'I don't know' is the most powerful starting point in any discovery. Embracing uncertainty made me a better researcher and a calmer person.",
  "I stayed in a friendship that was one-sided for years because I was afraid of being alone. Ending that relationship was painful, but the space it cleared was filled by new, reciprocal connections that actually nourish me.",
  "I was obsessed with my legacy and what people would say about me when I'm gone. A near-death experience taught me that the only thing that matters is how you make people feel right now. Legacy is the ripple of current kindness.",
  "I had a severe stutter as a child and felt so much shame. I eventually became a speech therapist to help others. My 'weakness' became the foundation of my career and my greatest point of connection with my patients.",
  "I was a competitive person who saw everyone as a rival. A collaborative project with a mentor showed me that 'we' is always more powerful than 'me'. Success is much sweeter when it's shared.",
  "I struggled with my body image for most of my life. I started taking powerlifting classes and focused on what my body could *do* rather than what it looked like. Strength replaced self-criticism, and I finally feel at home in my skin.",
  "I spent years trying to live a 'standard' life that made me miserable. I decided to move into a tiny house and live off-grid. Minimalist living gave me the mental clarity to pursue my true interests without the noise of consumerism.",
  "I was always afraid of change and stayed in my hometown long after I should have left. Taking a chance on a job in a big city was terrifying, but it forced me to grow in ways I never would have otherwise. Flight is the first step to freedom.",
  "I was a cynical person who thought most people were selfish. After a natural disaster, I saw a total stranger risk their life for another. It shattered my worldview and replaced it with a deep, persistent hope in human goodness.",
  "I struggled with addiction for a decade. Recovery taught me that every day is a series of choices, not a fixed destination. I celebrate my 'day ones' every single morning, and that humility keeps me sober.",
  "I was a very organized person who lost control when a crisis hit. I learned that resilience isn't 'bouncing back' to the old you, but 'bouncing forward' into someone new who has been forged by the fire.",
  "I spent my life waiting for the 'right time' to write a book. After losing a friend, I realized there is no right time, only now. I wrote the first chapter that night. Tomorrow is a hope, but today is a tool.",
  "I was a judge-mental person who looked down on those who struggled. My own journey through a mental health crisis taught me that everyone is carrying a private battle. My empathy is now my default, not my exception.",
  "I was afraid of being 'forgotten' in my old age. I started a mentoring program for local youth. Realizing that my wisdom can help a 20-year-old navigate a tough situation made me feel more relevant than ever.",
  "I was a perfectionist parent who wanted my kids to be the best. Seeing them struggle with anxiety because of my pressure made me change everything. Now we celebrate effort and kindness instead of grades. Joy returned to our home.",
  "I had a falling out with a sibling that lasted 20 years. I finally reached out with an apology for my part in it, without expecting them to apologize for theirs. The reconciliation that followed was the greatest relief of my life.",
  "I was a very logical person who dismissed intuition. A gut feeling saved me from a dangerous situation. I learned to trust the quiet voice inside me just as much as the loud voice of reason.",
  "I spent years trying to make my startup work and it eventually failed. I felt like a loser. Then I realized that the skills I learned while failing were exactly what my next successful partner was looking for. No effort is ever wasted.",
  "I was a very private person who kept my struggles to myself. Sharing my story of surviving loss in a support group was the first time I felt truly seen. Connection is the antidote to the isolation of grief.",
  "I was always 'too busy' for my aging parents. After they passed, the regret was heavy. I now make it a priority to visit my older neighbors. I can't change the past, but I can honor them by being present for others.",
  "I struggled with my faith during a time of immense suffering. I learned that doubt isn't the enemy of faith, but a necessary companion of growth. My belief system is now much more nuanced and compassionate.",
  "I was a very serious person who forgot how to laugh. After a long illness, I started watching comedies every day. Laughter became my medicine, and it reminded me that life is meant to be enjoyed, not just endured.",
  "I spent my life trying to 'fit in' and felt like an imposter. I finally embraced my quirks and found a community of people who were just as 'weird' as me. Authenticity is the magnet for the right people.",
  "I was afraid of the dark for most of my adult life. I decided to try 'stargazing' to change my relationship with the night. The vastness of the universe made my fears feel small and my existence feel miraculous.",
  "I was a very fast-paced person who hated waiting. A delayed flight led to a conversation with a stranger that changed my perspective on my career. I learned that the detours of life often have the best views.",
  "I spent my life trying to be 'special' and 'unique'. I eventually realized that my shared human experience—my fears, my joys, my common struggles—is my deepest point of connection with the world. We are all more alike than we are different."
];

const DB_PATH = path.join(process.cwd(), 'data', 'bottles.json');

async function populate() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is not set in .env');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  const bottles = [];

  console.log(`Starting population of ${stories.length} stories...`);

  for (let i = 0; i < stories.length; i++) {
    const text = stories[i];
    console.log(`[${i + 1}/${stories.length}] Embedding story: "${text.substring(0, 50)}..."`);
    
    try {
      const result = await model.embedContent(text);
      const embedding = result.embedding.values;
      const id = crypto.randomUUID();
      
      // Create a date in the past for variety
      const createdAt = new Date(Date.now() - (stories.length - i) * 24 * 60 * 60 * 1000).toISOString();
      bottles.push({ id, text, embedding, createdAt });
      
      // Small delay to avoid rate limits if any
      await new Promise(r => setTimeout(r, 200));
    } catch (error: any) {
      console.error(`Error embedding story ${i + 1}:`, error.message);
    }
  }

  try {
    // Read existing bottles first
    let currentBottles = [];
    try {
      const existingData = await fs.readFile(DB_PATH, 'utf-8');
      currentBottles = JSON.parse(existingData);
    } catch (e) {}

    const allBottles = [...currentBottles, ...bottles];
    await fs.writeFile(DB_PATH, JSON.stringify(allBottles, null, 2), 'utf-8');
    console.log(`\n✅ Success! Database now contains ${allBottles.length} stories.`);
  } catch (error: any) {
    console.error('Error saving to database:', error.message);
  }
}

populate();
