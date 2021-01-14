import React from 'react';


export type ReactStateHook<T> = [T, React.Dispatch<React.SetStateAction<string>>];
