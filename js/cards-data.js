// Cards alternate between a left and a right lane down the page. The lane is
// the only horizontal information a card carries — the exact column is derived
// from the grid at runtime (see laneColumns in grid.js), so every left card
// shares a column and every right card shares a column at any viewport width.
// Desktop and mobile used to differ only in that fraction, so there is one slot
// per card now rather than a pair that agreed on everything but the x.
window.WC_GRID_ITEMS = [
  {
    label: 'Dinner tonight',
    title: 'Takeout again',
    stat: 'You opened the app before you opened the fridge.',
    hoverTitle: 'Asian cuisine',
    hoverStat: "Order something you can't pronounce.",
    icon: 'img/categories/dinner.png',
    slot: { lane: 'left', row: 3, w: 4, h: 4 },
  },
  {
    label: 'Coffee shop',
    title: 'The usual',
    stat: 'They started making it when you walked in.',
    hoverTitle: "Barista's choice",
    hoverStat: 'Ask them to surprise you.',
    icon: 'img/categories/coffeeshop.png',
    slot: { lane: 'right', row: 8, w: 4, h: 4 },
  },
  {
    label: 'Restaurant order',
    title: 'Same order',
    stat: "You didn't open the menu.",
    hoverTitle: 'Dessert first',
    hoverStat: 'Order dessert as your starter.',
    icon: 'img/categories/restaurant.png',
    slot: { lane: 'left', row: 13, w: 4, h: 4 },
  },
  {
    label: 'Workout',
    title: 'Leg day',
    stat: 'The one you always reschedule.',
    hoverTitle: 'Walk double the usual',
    hoverStat: 'Twice your normal route.',
    icon: 'img/categories/workout.png',
    slot: { lane: 'right', row: 18, w: 4, h: 4 },
  },
  {
    label: 'Screen time',
    title: 'Comfort rewatch',
    stat: "You already know what's on tonight.",
    hoverTitle: 'Watchlist roulette',
    hoverStat: "Whatever it lands on — watch that.",
    icon: 'img/categories/screentime.png',
    slot: { lane: 'left', row: 23, w: 4, h: 4 },
  },
  {
    label: 'Friday night',
    title: 'Same plans',
    stat: 'Same answer you gave last Friday.',
    hoverTitle: 'New neighborhood',
    hoverStat: 'A part of town you never visit.',
    icon: 'img/categories/weekend.png',
    slot: { lane: 'right', row: 28, w: 4, h: 4 },
  },
  {
    label: 'Reach out',
    title: 'They text first',
    stat: "You're always just replying.",
    hoverTitle: 'Out of the blue',
    hoverStat: "Text someone who isn't expecting it.",
    icon: 'img/categories/reachout.png',
    slot: { lane: 'left', row: 33, w: 4, h: 4 },
  },
  {
    label: 'Wind down',
    title: 'Phone in bed',
    stat: 'Meant to sleep. Still scrolling.',
    hoverTitle: 'Tea ritual',
    hoverStat: 'Make a hot drink. Finish it screen-free.',
    icon: 'img/categories/winddown.png',
    slot: { lane: 'right', row: 38, w: 4, h: 4 },
  },
];
