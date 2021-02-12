import React, { useState } from 'react';
import { animated, config, useSpring } from 'react-spring';
import { HashRouter as Router, NavLink, Route, Switch } from 'react-router-dom';

export function App() {
  return (
    <Router>
      <>
        <a href="https://github.com/lourd/cursor-follow" className="source">
          Cursor Follow Motion Study
        </a>
        <div className="links">
          <NavLink exact to="/">
            Exact Follow
          </NavLink>
          <NavLink to="/second">Spring-based follow</NavLink>
          <NavLink to="/third">Spring-based follow {'&'} scale</NavLink>
        </div>
        <Switch>
          <Route exact path="/second">
            <Second />
          </Route>
          <Route exact path="/third">
            <Third />
          </Route>
          <Route path="/">
            <First />
          </Route>
        </Switch>
      </>
    </Router>
  );
}

/**
 * Immediate matching of the circle's position to the mouse. Updates the state
 * through React's rendering with `useState`.
 */
function First() {
  let [{ x, y }, set] = useState({ x: 0, y: 0 });
  const handleMouseMove = (
    evt: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    set({ x: evt.clientX, y: evt.clientY });
  };

  return (
    <svg onMouseMove={handleMouseMove}>
      <circle cx={x} cy={y} r={24} fill="green"></circle>
    </svg>
  );
}

/**
 * Delayed movement of the circle to the mouse, mediated through a spring
 * object. Updates the state outside of React's rendering with `useSpring`.
 */
function Second() {
  const [{ x, y }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    config: config.wobbly,
  }));
  const handleMouseMove = (
    evt: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    set({ x: evt.clientX, y: evt.clientY });
  };
  return (
    <svg onMouseMove={handleMouseMove}>
      <animated.circle cx={x} cy={y} r={24} fill="green"></animated.circle>
    </svg>
  );
}

function Third() {
  const [{ xy }, set] = useSpring(() => ({
    xy: [0, 0],
    config: config.wobbly,
  }));
  // Using a separate spring for the scale to be able to have a different
  // config
  const [{ scaleX }, setScaleX] = useSpring(() => ({
    scaleX: 1,
    config: config.stiff,
  }));
  const handleMouseMove = (
    evt: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    set({ xy: [evt.clientX, evt.clientY] });
    const [currentX] = xy.get();
    // If the mouse is to the right of the object, leave it "facing" right
    // its original scale. If the mouse is to the left of the object, flip it
    // around to face right.
    setScaleX({ scaleX: evt.clientX > currentX ? 1 : -1 });
  };
  return (
    <svg onMouseMove={handleMouseMove}>
      <animated.g
        transform={xy.to((x, y) => {
          return `translate(${x} ${y}) scale(${scaleX.get()} 1)`;
        })}
      >
        {/* Static transform here to effectively move the transform origin for the parent */}
        <g width="196" height="51" transform="translate(-98 -44)">
          <path
            d="M66.5 11.5C80 17.5673 96.0001 44 96.0001 44C96.0001 44 91.5001 24.2813 89.0001 20.2364C86.5001 16.1915 65.5001 2.03447 48.0001 1.02325C30.5001 0.0120331 14.5 8.5 14.5 8.5C14.5 8.5 8.5 19.0842 20 11.5C31.5 3.91585 53 5.43269 66.5 11.5Z"
            fill="#393939"
            stroke="#393939"
          />
          <path
            d="M65.5 27.2364C79 33.3037 96.5 42.5 96.5 42.5C96.5 42.5 91.5 31.2812 89 27.2364C86.5 23.1915 64 9.51119 46.5 8.49997C29 7.48875 19 16 19 16C19 16 7.50003 34.8205 19 27.2364C30.5 19.6522 52 21.1691 65.5 27.2364Z"
            fill="#393939"
            stroke="#393939"
          />
          <circle cx="97" cy="43" r="8" fill="#393939" />
        </g>
      </animated.g>
    </svg>
  );
}
