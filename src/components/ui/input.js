import React from 'react';

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    className={`border rounded px-3 py-2 w-full ${className}`}
    ref={ref}
    {...props}
  />
));
