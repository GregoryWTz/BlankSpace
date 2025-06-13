import mainMap from '../../assets/Maps/Main-Map.jpg';
import butterMap from '../../assets/Maps/butter-planet-bg.png';
import appleMap from '../../assets/Maps/apple-planet.png';
import coffeeMap from '../../assets/Maps/coffee-planet-bg.png';
import donutMap from '../../assets/Maps/donut-planet.png';
import cookieMap from '../../assets/Maps/cookie-planet-bg.png';
import butterHouse from '../../assets/Maps/Butter-House.png';
import coffeeHouse from '../../assets/Maps/coffee-house.png';
import cookieHouse from '../../assets/Maps/cookie-house.png';
import donutHouse from '../../assets/Maps/Donut-House.png';
import abandonedMap from '../../assets/Maps/Abandoned-City.png';
import abandonedHouse from '../../assets/Maps/abandoned-house.png';
import appleHouse from '../../assets/Maps/apple-house.png';

export const maps = {
  Apple: {
    background: `url(${appleMap})`,
    planets: [],
    building: {
      name: 'Apple Orchard',
      src: appleHouse,
      style: { top: '40%', left: '60%', width: '200px' },
      actions: [
        { label: 'Harvest Apples (Free)', item: { name: 'Apple', affectsBar: 0, increaseBy: 10 }, cost: 0 },
        { label: 'Eat Apple (Cost: 16,200)', stat: 2, delta: +5, cost: 200 * 81 },
        { label: 'Sell Apple Crate (x1) (+1,215)', sellItem: 'Apple', gain: 15 * 81 },
        { label: 'Make Apple Pie (Cost: 810)', stat: 0, delta: +15, cost: 10 * 81 }
      ]
    }
  },
  Butter: {
    background: `url(${butterMap})`,
    planets: [],
    building: {
      name: 'Butter Bathhouse',
      src: butterHouse,
      style: { top: '55%', left: '50%', width: '80px' },
      actions: [
        { label: 'Take Shower (Cost: 180)', stat: 1, delta: +25, cost: 20 * 9 },
        { label: 'Relax (Cost: 135)', stat: 3, delta: +10, cost: 15 * 9 },
        { label: 'Get Butter Massage (Cost: 225)', stat: 1, delta: +15, cost: 25 * 9 },
        { label: 'Buy Scented Butter Soap (Cost: 90)', stat: 3, delta: +5, cost: 10 * 9 },
        { label: 'Churn Butter (Free)', item: { name: 'Butter', affectsBar: 0, increaseBy: 5 }, cost: 0 },
        { label: 'Sell Butter (+225)', sellItem: 'Butter', gain: 25 * 9 }
      ]
    }
  },
  Coffee: {
    background: `url(${coffeeMap})`,
    planets: [],
    building: {
      name: 'Coffee House',
      src: coffeeHouse,
      style: { left: '45%', top: '40%', width: '200px' },
      actions: [
        { label: 'Buy Coffee (Cost: 405)', stat: 2, delta: +20, cost: 15 * 27 },
        { label: 'Read Newspaper (Cost: 135)', stat: 3, delta: +5, cost: 5 * 27 },
        { label: 'Chat with Barista (Cost: 135)', stat: 3, delta: +10, cost: 5 * 27 },
        { label: 'Try Espresso Challenge (Cost: 540)', stat: 2, delta: +25, cost: 20 * 27 },
        { label: 'Brew Coffee (Free)', item: { name: 'Coffee', affectsBar: 0, increaseBy: 1 }, cost: 0 },
        { label: 'Sell Coffee (+270)', sellItem: 'Coffee', gain: 10 * 27 }
      ]
    }
  },
  Donut: {
    background: `url(${donutMap})`,
    planets: [],
    building: {
      name: 'Donut Shop',
      src: donutHouse,
      style: { top: '20%', left: '70%', width: '200px' },
      actions: [
        { label: 'Buy Donut (Cost: 60)', stat: 0, delta: +15, cost: 20 * 3 },
        { label: 'Chat with Staff (Cost: 15)', stat: 3, delta: +5, cost: 5 * 3 },
        { label: 'Try Secret Donut (Cost: 75)', stat: 0, delta: +20, cost: 25 * 3 },
        { label: 'Donut-Eating Contest (Cost: 90)', stat: 0, delta: +30, cost: 30 * 3 },
        { label: 'Bake Donut (Free)', item: { name: 'Donut', affectsBar: 0, increaseBy: 1 }, cost: 0 },
        { label: 'Sell Donut (+45)', sellItem: 'Donut', gain: 15 * 3 }
      ]
    }
  },
  Cookie: {
    background: `url(${cookieMap})`,
    planets: [],
    building: {
      name: 'Cookie Cabin',
      src: cookieHouse,
      style: { top: '40%', left: '55%', width: '120px' },
      actions: [
        { label: 'Buy Cookies (Cost: 15)', stat: 0, delta: +10, cost: 15 * 1 },
        { label: 'Rest Inside (Cost: 10)', stat: 1, delta: +20, cost: 10 * 1 },
        { label: 'Bake Cookies (Cost: 10)', stat: 1, delta: +15, cost: 10 * 1 },
        { label: 'Trade Recipes (Free)', stat: 3, delta: +10, cost: 0 },
        { label: 'Make Cookie Batch (Free)', item: { name: 'Cookie', affectsBar: 0, increaseBy: 1 }, cost: 0 },
        { label: 'Sell Cookie (+10)', sellItem: 'Cookie', gain: 10 * 1 }
      ]
    }
  },
  Abandoned: {
    background: `url(${abandonedMap})`,
    planets: [],
    building: {
      name: 'Abandoned House',
      src: abandonedHouse,
      style: { top: '20%', left: '70%', width: '200px' },
      actions: [
        { label: 'Explore (Free)', stat: 3, delta: +5, cost: 0 },
        { label: 'Rest (Free)', stat: 1, delta: +10, cost: 0 },
        { label: 'Scavenge Supplies (Free)', stat: 0, delta: +10, cost: 0 },
        { label: 'Challenge the Forgotten Guardian (Cost: 14,580)', cost: 14580, special: 'bossBattle' }
      ]
    }
  },
  Default: {
    background: `url(${mainMap})`,
    planets: [
      { id: 'Apple', src: 'assets/planetA.png', style: { top: '60%', left: '60%' } },
      { id: 'Butter', src: 'assets/planetB.png', style: { top: '2%', left: '25%' } },
      { id: 'Cookie', src: 'assets/planetC.png', style: { top: '35%', left: '5%' } },
      { id: 'Donut', src: 'assets/planetD.png', style: { top: '60%', left: '30%' } },
      { id: 'Coffee', src: 'assets/planetE.png', style: { top: '10%', left: '55%' } },
      { id: 'Abandoned', src: 'assets/planetG.png', style: { top: '15%', left: '70%' } }
    ]
  }
};
