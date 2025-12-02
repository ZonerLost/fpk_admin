// import React from "react";
// import SectionCard from "../../shared/layout/SectionCard";
// import { cn } from "../../shared/utils/cn";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// type Props = {
//   year: number;
//   month: number;          // 0-based
//   sessionDates?: string[]; // ["2024-10-28", ...]
// };

// type CalendarCell = Date | null;

// const buildMonthMatrix = (year: number, month: number): CalendarCell[][] => {
//   const firstDay = new Date(year, month, 1);
//   const lastDay = new Date(year, month + 1, 0);
//   const weeks: CalendarCell[][] = [];

//   let currentWeek: CalendarCell[] = new Array(7).fill(null);
//   let weekday = firstDay.getDay(); // 0 = Sun

//   for (let day = 1; day <= lastDay.getDate(); day++) {
//     const date = new Date(year, month, day);
//     currentWeek[weekday] = date;

//     if (weekday === 6 || day === lastDay.getDate()) {
//       weeks.push(currentWeek);
//       currentWeek = new Array(7).fill(null);
//     }

//     weekday = (weekday + 1) % 7;
//   }

//   return weeks;
// };

// const MonthlyCalendarCard: React.FC<Props> = ({
//   year,
//   month,
//   sessionDates = [],
// }) => {
//   const [displayYear, setDisplayYear] = React.useState(year);
//   const [displayMonth, setDisplayMonth] = React.useState(month);
//   const [selected, setSelected] = React.useState<Date | null>(null);

//   const matrix = React.useMemo(
//     () => buildMonthMatrix(displayYear, displayMonth),
//     [displayYear, displayMonth]
//   );

//   const sessionSet = React.useMemo(() => {
//     return new Set(
//       sessionDates.map((d) => {
//         const date = new Date(d);
//         return date.toDateString();
//       })
//     );
//   }, [sessionDates]);

//   const handlePrev = () => {
//     setDisplayMonth((m) => {
//       if (m === 0) {
//         setDisplayYear((y) => y - 1);
//         return 11;
//       }
//       return m - 1;
//     });
//   };

//   const handleNext = () => {
//     setDisplayMonth((m) => {
//       if (m === 11) {
//         setDisplayYear((y) => y + 1);
//         return 0;
//       }
//       return m + 1;
//     });
//   };

//   const monthLabel = new Date(displayYear, displayMonth, 1).toLocaleString(
//     undefined,
//     { month: "long", year: "numeric" }
//   );

//   const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

//   return (
//     <SectionCard
//       title={monthLabel}
//       className="bg-[#04130d]"
//       contentClassName="pt-3"
//       trailing={
//         <div className="flex items-center gap-2 text-slate-200">
//           <button
//             type="button"
//             onClick={handlePrev}
//             className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
//           >
//             <FiChevronLeft className="h-4 w-4" />
//           </button>
//           <button
//             type="button"
//             onClick={handleNext}
//             className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
//           >
//             <FiChevronRight className="h-4 w-4" />
//           </button>
//         </div>
//       }
//     >
//       {/* Weekday header */}
//       <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-400">
//         {weekdayLabels.map((label) => (
//           <div key={label} className="py-1">
//             {label}
//           </div>
//         ))}
//       </div>

//       {/* Calendar grid */}
//       <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs text-slate-100">
//         {matrix.map((week, i) =>
//           week.map((date, j) => {
//             if (!date) {
//               return <div key={`${i}-${j}`} className="h-8" />;
//             }

//             const isSelected =
//               selected &&
//               date.toDateString() === selected.toDateString();
//             const hasSession = sessionSet.has(date.toDateString());

//             return (
//               <button
//                 key={`${i}-${j}`}
//                 type="button"
//                 onClick={() => setSelected(date)}
//                 className={cn(
//                   "relative flex h-8 w-8 items-center justify-center rounded-full text-[11px] md:h-9 md:w-9",
//                   isSelected
//                     ? "bg-emerald-500 text-black"
//                     : "hover:bg-white/10"
//                 )}
//               >
//                 {date.getDate()}
//                 {hasSession && (
//                   <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                 )}
//               </button>
//             );
//           })
//         )}
//       </div>
//     </SectionCard>
//   );
// };

// export default MonthlyCalendarCard;
