import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "../../StyleSheets/theme";
import { DateTime } from "luxon";

const WeekDaySelectionBoxWidth = 175;
const WeekDaySelectionBoxHeight = 24;

const FrequencyWeekBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
const WeekDaySelectionBox = styled.div`
  position: relative;
  width: ${WeekDaySelectionBoxWidth}px;
  height: ${WeekDaySelectionBoxHeight}px;

  &:hover {
    cursor: pointer;
  }
`;

const ToggleButtonWidth = WeekDaySelectionBoxWidth / 7;
const ToggleButton = styled.div`
  position: absolute;
  top: 0px;
  left: ${({ $idx }) => ToggleButtonWidth * $idx}px;
  width: ${ToggleButtonWidth}px;
  height: ${WeekDaySelectionBoxHeight}px;

  color: ${theme.blues[8]};
  font-family: "Inter", sans-serif;
  align-content: space-around;

  border: solid 1px ${theme.blues[8]};
  --radius: 6px;
  border-radius: ${({ $isEdge }) =>
    $isEdge === "l" ? `var(--radius) 0px 0px var(--radius)` : $isEdge === "r" ? `0px var(--radius) var(--radius) 0px` : `0px`};
  background-color: ${({ $selected }) => ($selected ? theme.blues[1] : theme.blues[3])};
`;

const WeekDay = ({ day, isEdge, idx, isSelected, saveCal }) => {
  const [selected, setSelected] = useState(isSelected);

  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);

  const onClickThis = () => {
    setSelected(!selected);
    saveCal(idx,!selected);
  };

  // console.log(day.toFormat("ccc").slice(0, 1));
  return (
    <ToggleButton $selected={selected} $isEdge={isEdge} $idx={idx} onClick={onClickThis}>
      {day.toFormat("ccc").slice(0, 1)}
    </ToggleButton>
  );
};

function FrequencyWeek({calendar}) {
  const startOfWeek = DateTime.now().startOf("week").plus({ days: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.plus({ days: i }));

  console.log(calendar);
  const availablity = calendar.data.availablity || Array.from({ length: 7 }, (_, i) => 0);

  const saveCal = (idx, s )=>{
    calendar.data.availablity[idx] =s| 0
    calendar.save();
  }

  return (
    <FrequencyWeekBox>
      <span>Frequency :</span>
      <WeekDaySelectionBox>
        {weekDays.map((day, idx) => (
          <WeekDay
            key={idx}
            idx={idx}
            day={day}
            isSelected={availablity[idx] === 1}
            saveCal={saveCal}
            isEdge={idx === 0 ? "l" : idx === weekDays.length - 1 ? "r" : "none"}
          />
        ))}
      </WeekDaySelectionBox>
    </FrequencyWeekBox>
  );
}

export default FrequencyWeek;
