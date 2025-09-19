import HomePage from '@/components/Homepage/HomePage';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <div>
      <Suspense fallback={""}>
        <HomePage />
      </Suspense>
    </div>
  );
};

export default page;