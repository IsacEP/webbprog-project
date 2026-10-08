import { useEffect, useState } from "react";
import type { Question } from "./lib/questions";

async function safeFetchJson<T>(url: string | URL, init?: RequestInit) {
  return fetch(url, init).then((response) => {
    if (!response.ok) {
      throw new Error(
        `${url} returned status ${response.status} - (${response.statusText})}`
      );
    }
    return response.json() as Promise<T>;
  });
}
type ApiResponse = {
  response_code: number;
  results: {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }[];
};

async function fetchQuestions(baseURL: string): Promise<Question[]> {
  const response = await safeFetchJson<ApiResponse>(
    new URL("api.php?amount=3&type=multiple&encode=url3986", baseURL)
  );
  if (response.response_code !== 0) {
    throw new Error(`${baseURL} returned response_code ${response.response_code}`);
  }
  return response.results.map((result) => {
    const correctAnswer = decodeURIComponent(result.correct_answer);
    const answers = [
      correctAnswer,
      ...result.incorrect_answers.map((answer) => decodeURIComponent(answer)),
    ].sort(() => Math.random() - 0.5);
    return {
      question: decodeURIComponent(result.question),
      answers,
      correct: answers.indexOf(correctAnswer),
    };
  });
}
function todayKey(date = new Date()) {
  return date.toLocaleDateString("sv-SE");
}

function readQuestions(): Question[] {
  const json = localStorage.getItem(`questions-${todayKey()}`);
  if (json === null) return [];
  try {
    return JSON.parse(json) as Question[];
  } catch {
    return [];
  }
}
let request: Promise<Question[]> | undefined;

function useFetchQuestions(baseURL: string) {
  const [data, setData] = useState<Question[]>(readQuestions);
  useEffect(() => {
    if (data.length > 0) return;
    let ignore = false;
    request ??= fetchQuestions(baseURL).then((questions) => {
      localStorage.setItem(`questions-${todayKey()}`, JSON.stringify(questions));
      return questions;
    });
    request.then(
      (questions) => {
        if (!ignore) {
          setData(questions);
        }
      },
      (error) => {
        request = undefined;
        console.error(error);
      }
    );
    return () => {
      ignore = true;
    };
  }, [baseURL, data.length]);
  return data;
}

export { useFetchQuestions, safeFetchJson, fetchQuestions, todayKey };
