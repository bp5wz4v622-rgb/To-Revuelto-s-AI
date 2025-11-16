import React from 'react';

// Using Heroicons (MIT License) - https://heroicons.com/

export const SearchIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const ImageIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const BrainIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5">
        <path d="M6.5 13.5C5.5 13.5 5.5 12 4 12C2.5 12 2.5 13.5 3.5 14.5C4.5 15.5 6 17.5 6 19.5C6 21.5 8.5 22.5 10 21.5C11.5 20.5 12.5 20 13 18.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.5 13.5C18.5 13.5 18.5 12 20 12C21.5 12 21.5 13.5 20.5 14.5C19.5 15.5 18 17.5 18 19.5C18 21.5 15.5 22.5 14 21.5C12.5 20.5 11.5 20 11 18.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 18.5C13.2667 17.5 14.5 16 16 15.5C17.5 15 17.5 13.5 17.5 13.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 18.5C10.7333 17.5 9.5 16 8 15.5C6.5 15 6.5 13.5 6.5 13.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 18.5C11.3333 19.1667 11.5 20.1 10 21.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 18.5C12.6667 19.1667 12.5 20.1 14 21.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 13.5C6.5 12.5 7.5 11.5 8.5 10C9.5 8.5 9.5 7 8 6C6.5 5 5 4.5 4 4.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.5 13.5C17.5 12.5 16.5 11.5 15.5 10C14.5 8.5 14.5 7 16 6C17.5 5 19 4.5 20 4.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5 10C14.5 10.5 13 10.5 12 10.5C11 10.5 9.5 10.5 8.5 10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 10.5C12.5 9.5 12.5 8 12 7C11.5 6 10.5 5.5 10 4.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 10.5C11.5 9.5 11.5 8 12 7C12.5 6 13.5 5.5 14 4.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const DocumentIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const EllipsisVerticalIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
);

export const ChatBubbleLeftRightIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H17z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16H5a2 2 0 01-2-2V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H13" />
    </svg>
);

export const MicrophoneIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

export const DocumentCheckIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
    </svg>
);

export const QuestionMarkCircleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);
