import React from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { Move, RPS_MOVEMENTS } from 'config/rps';

export type MoveSelectorProps = {
  value: Move;
  onChange: (event: React.MouseEvent<HTMLElement>, newMovement: Move) => void;
};

const MoveSelector: React.FC<MoveSelectorProps> = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup
      sx={{ mb: 2 }}
      value={value}
      onChange={onChange}
      exclusive
      color="primary"
    >
      {RPS_MOVEMENTS.map((action) => (
        <ToggleButton key={action.move} value={action.move}>
          {action.name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default MoveSelector;