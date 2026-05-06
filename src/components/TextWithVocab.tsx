import React from 'react';
import { vocabDict } from '../lib/data';

interface Props {
  text: string;
}

export const TextWithVocab: React.FC<Props> = ({ text }) => {
  const wordsAndPunctuation = text.split(/(\b\w+\b)/g);

  return (
    <span>
      {wordsAndPunctuation.map((part, index) => {
        const cleanPart = part.toLowerCase();
        if (vocabDict[cleanPart as keyof typeof vocabDict]) {
          return (
            <span key={index} className="group vocab-word text-[#262626] hover:text-[#FF5733] transition-colors">
              {part}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#262626] text-[#F5F5F5] text-xs text-left z-20 hidden group-hover:block pointer-events-none normal-case tracking-normal font-normal leading-tight">
                {vocabDict[cleanPart as keyof typeof vocabDict]}
              </span>
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
