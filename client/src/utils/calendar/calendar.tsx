/*******************************************************************
 * FmCalendar uses DateCalendar to remap the dates from Sunday as  *
 * first day of week, to Monday as first day of week.              *
 *******************************************************************/
import { DateCalendar, DateCalendarProps } from "@mui/x-date-pickers";
import React, { useEffect } from "react";

const FmCalendar: React.FC<DateCalendarProps<Date>> = (props) => {
  useEffect(() => {
    // Move the Sunday header element to the last position
    const headerElement = document.querySelector<HTMLDivElement>(
      ".MuiDayCalendar-header"
    );
    if (!headerElement) return;
    const sundayElement = headerElement.querySelector<HTMLDivElement>(
      '[aria-label="Sunday"]'
    );
    // Get month container
    const monthContainer = document.querySelector<HTMLDivElement>(
      ".MuiDayCalendar-monthContainer"
    );

    /** GUARD **/
    if (
      !monthContainer ||
      sundayElement === headerElement.lastChild ||
      !sundayElement
    )
      return;
    // fix weekday header
    headerElement.appendChild(sundayElement);

    // Get week containers
    const weeksContainers = document.querySelectorAll<HTMLDivElement>(
      ".MuiDayCalendar-weekContainer"
    );
    // Collect the days
    const days = monthContainer.querySelectorAll("[data-timestamp]");
    // filler (blank) day
    const weekLen: number = 6;
    const daysInWeek: number = 7;

    if (weeksContainers) {
      // Start assembling the new monthContainer
      let newMonthContainer = monthContainer;
      newMonthContainer.innerHTML = "";

      // if there are only 4 weeks in the month (february every now and then)
      // create a new week because when we shift the dates there will be 5 weeks
      let newWeekContainer: HTMLDivElement | null = null;

      // Check how many dates in the old first week
      const daysInFirstWeek: number =
        weeksContainers[0].querySelectorAll<HTMLButtonElement>("button").length;

      const fillerDay = monthContainer.querySelector<HTMLDivElement>(
        ".MuiPickersDay-hiddenDaySpacingFiller"
      );

      const newWeekFillerDays: number = 6;
      const firstWeekFillerDaysLen: number =
        daysInFirstWeek < daysInWeek
          ? daysInWeek - (daysInFirstWeek + 1)
          : newWeekFillerDays;

      let dayIndex = 0;
      const getDayIndex = (): number => {
        const currentDayIndex = dayIndex;
        dayIndex++;
        return currentDayIndex;
      };

      weeksContainers.forEach((week, index) => {
        // first week
        if (index === 0 && fillerDay) {
          //   empty the week
          week.innerHTML = "";
          for (let i = 0; i < firstWeekFillerDaysLen; i++) {
            week.append(fillerDay);
          }
          for (let i = 0; i < daysInWeek - firstWeekFillerDaysLen; i++) {
            week.append(days[getDayIndex()]);
          }
        }

        // Check if we need to add a week. In that case wee add the new week last
        if (weeksContainers.length < 5 && index === 4) {
          //   // copy a week container
          //   newWeekContainer = weeksContainers[0];
          //   // empty it
          //   newWeekContainer.innerHTML = "";
          //   //   fill in 6 filler days
          //   for (let d = 0; d < weekLen - 1; d++) {
          //     if (fillerDay) {
          //       newWeekContainer.append(fillerDay);
          //     }
          //   }
          //   newWeekContainer.append(days[0]);
        }

        for (let i = 0; i < daysInWeek; i++) {
          week.append(days[getDayIndex()]);
        }
      });
    }
  }, []);

  return <DateCalendar {...props} />;
};

export default FmCalendar;
