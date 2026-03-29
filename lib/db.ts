import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const NEEDS_FILE = path.join(DATA_DIR, 'needs.json');
const SOLUTIONS_FILE = path.join(DATA_DIR, 'solutions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure files exist
if (!fs.existsSync(NEEDS_FILE)) {
  fs.writeFileSync(NEEDS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(SOLUTIONS_FILE)) {
  fs.writeFileSync(SOLUTIONS_FILE, JSON.stringify([]));
}

export type UserNeed = {
  id: string;
  content: string;
  summary: string;
  tags: string[];
  createdAt: string;
};

export type UserSolution = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  createdAt: string;
};

export function getNeeds(): UserNeed[] {
  const data = fs.readFileSync(NEEDS_FILE, 'utf8');
  return JSON.parse(data);
}

export function saveNeed(need: UserNeed) {
  const needs = getNeeds();
  needs.push(need);
  fs.writeFileSync(NEEDS_FILE, JSON.stringify(needs, null, 2));
}

export function getSolutions(): UserSolution[] {
  const data = fs.readFileSync(SOLUTIONS_FILE, 'utf8');
  return JSON.parse(data);
}

export function saveSolution(solution: UserSolution) {
  const solutions = getSolutions();
  solutions.push(solution);
  fs.writeFileSync(SOLUTIONS_FILE, JSON.stringify(solutions, null, 2));
}
