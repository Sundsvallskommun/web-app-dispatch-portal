import React from 'react';
import { RecipientTable } from 'src/recipient-table/recipient-table.component';

export const RecipientList: React.FC = () => {
  return (
    <div className="w-full">
      <RecipientTable showRemoveButton />
    </div>
  );
};
