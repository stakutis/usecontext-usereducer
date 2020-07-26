/******************************************
 * The basic idea...
 *
 * AVOID REDUX!!
 *
 * First, here is my decent  paper desscribing this technique:
 *    https://docs.google.com/document/d/196mrTJM_a2bJBYNieY_30trE8eulb8UGrR60mYqmjJg/edit?usp=sharing
 *
 * React's 'context' (createContext(), useContext()) is very cool.  It allows a higher-up  component to
 * create an object/store  and  make that available to  any lower level component  w/o doing props drilling.
 *
 * But it is kinda read-only.
 *
 * Now, imagine your 'store' is some object and you use [say] useState() to create the initial object and
 * you get back two items: the current value  of the store, and a setter to change it. Normal useState() stuff.
 * So let's now create a context (usually  imported from another file so that subordinate functions  can also
 * use it).  And when  you use the context.Provider you pass-in an object  that is two two items returned from useState().
 * Inside the subordinate  functions, when you do useContext(), you destructure to get the same to simple item names.
 * Now this subordinate  function can display the current store/state  fields, and it can call the setter to update it
 * and all the right re-rendering will occur.
 *
 * A slight downside is if this store/state is big and only want to change one item or one sub-tree, you still have
 * to provide back full store/state to the setter; not  a real bigger and you can use destructurig to  help.
 *
 * Or, use my useReducer  trick shown here also which does that blend automatically; and  FEELS so much like
 * the old class-based this.setState() (which did a merge).
 ****************************************** */

import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";
import "./App.css";

const myContext = createContext();
const mySecondContext = createContext();

function App() {
  // Here  is the more traditional  useState() approach:
  const [second, setSecond] = useState({ four: 4, five: 5 });
  // Here is the cooler useReducer with auto-blend approach:
  const [obj, setObj] = useReducer(
    (oldState, actionData) => ({ ...oldState, ...actionData }),
    { one: 41, two: 42, three: 43 }
  );

  return (
    <mySecondContext.Provider value={{ second, setSecond }}>
      <myContext.Provider value={{ obj, setObj }}>
        <div className="App">
          <header className="App-header">
            <p>Let's test useContext+useReducer</p>
          </header>
          <div>My body here</div>
          <MyTest />
          One is: {obj.one}
          <MyTest />
          second.four:{second.four} second.five:{second.five}
        </div>
      </myContext.Provider>
    </mySecondContext.Provider>
  );
}

function MyTest(props) {
  const { obj, setObj } = useContext(myContext);
  const { second, setSecond } = useContext(mySecondContext);

  console.log("obj:", obj);
  useEffect(() => {
    setObj({ one: 11 });
  }, []);
  return (
    <div>
      My Test! one:{obj.one} second.four: {second.four}
      <button
        onClick={(e) => {
          setSecond({ four: 400 }); // Notice  it will blow away the .five slot!
          setObj({ one: obj.one + 12 }); // This does an automatic  merge!
        }}
      >
        Click!
      </button>{" "}
    </div>
  );
}

export default App;
