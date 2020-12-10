// The provider pattern
import React, {Fragment} from 'react'
import {Switch} from '../switch'

<<<<<<< HEAD
// 🐨 create your React context here with React.createContext

class Toggle extends React.Component {
  // 🐨 expose the ToggleContext.Consumer as a static property of Toggle here.
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  render() {
    // 🐨 replace this with rendering the ToggleContext.Provider
    return this.props.children({
      on: this.state.on,
      toggle: this.toggle,
    })
=======
const ToggleContext = React.createContext({
  on: false,
  reset: () => {},
  toggle: () => {},
  getTogglerProps: () => {},
})

const callAll = (...fns) => (...args) =>
  fns.forEach((fn) => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
    onToggle: () => {},
    onStateChange: () => {},
    stateReducer: (state, changes) => changes,
  }
  static stateChangeTypes = {
    reset: '__toggle_reset__',
    toggle: '__toggle_toggle__',
  }

  static Consumer = ToggleContext.Consumer
  reset = () =>
    this.internalSetState(
      {...this.initialState, type: Toggle.stateChangeTypes.reset},
      () => this.props.onReset(this.getState().on),
    )
  toggle = ({type = Toggle.stateChangeTypes.toggle} = {}) =>
    this.internalSetState(
      ({on}) => ({type, on: !on}),
      () => this.props.onToggle(this.getState().on),
    )
  getTogglerProps = ({onClick, ...props} = {}) => ({
    onClick: callAll(onClick, () => this.toggle()),
    'aria-expanded': this.getState().on,
    ...props,
  })
  initialState = {
    on: this.props.initialOn,
    reset: this.reset,
    toggle: this.toggle,
    getTogglerProps: this.getTogglerProps,
  }
  state = this.initialState
  isControlled(prop) {
    return this.props[prop] !== undefined
  }
  getState(state = this.state) {
    return Object.entries(state).reduce(
      (combinedState, [key, value]) => {
        if (this.isControlled(key)) {
          combinedState[key] = this.props[key]
        } else {
          combinedState[key] = value
        }
        return combinedState
      },
      {},
    )
  }
  internalSetState(changes, callback = () => {}) {
    let allChanges
    this.setState(
      (state) => {
        const combinedState = this.getState(state)
        // handle function setState call
        const changesObject =
          typeof changes === 'function'
            ? changes(combinedState)
            : changes

        // apply state reducer
        allChanges =
          this.props.stateReducer(combinedState, changesObject) || {}

        // remove the type so it's not set into state
        const {type: ignoredType, ...onlyChanges} = allChanges

        const nonControlledChanges = Object.keys(
          combinedState,
        ).reduce((newChanges, stateKey) => {
          if (!this.isControlled(stateKey)) {
            newChanges[stateKey] = onlyChanges.hasOwnProperty(
              stateKey,
            )
              ? onlyChanges[stateKey]
              : combinedState[stateKey]
          }
          return newChanges
        }, {})

        // return null if there are no changes to be made
        return Object.keys(nonControlledChanges || {}).length
          ? nonControlledChanges
          : null
      },
      () => {
        // call onStateChange with all the changes (including the type)
        this.props.onStateChange(allChanges, this.state)
        callback()
      },
    )
  }
  render() {
    return (
      <ToggleContext.Provider value={this.state}>
        {this.props.children}
      </ToggleContext.Provider>
    )
>>>>>>> frontend-masters
  }
}

// 💯 Extra credit: Add a custom Consumer that validates the
// ToggleContext.Consumer is rendered within a provider
//
// 💯 Extra credit: avoid unecessary re-renders by only updating the value when
// state changes
//
<<<<<<< HEAD
// 💯 Extra credit: support render props as well
//
// 💯 Extra credit: support (and expose) compound components!

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
const Layer1 = () => <Layer2 />
const Layer2 = () => (
  <Toggle.Consumer>
    {({on}) => (
      <Fragment>
        {on ? 'The button is on' : 'The button is off'}
        <Layer3 />
      </Fragment>
    )}
  </Toggle.Consumer>
)
const Layer3 = () => <Layer4 />
const Layer4 = () => (
  <Toggle.Consumer>
    {({on, toggle}) => <Switch on={on} onClick={toggle} />}
  </Toggle.Consumer>
)

function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
=======
/////////////////////////////////////////////////////////

function Nav() {
  return (
    <Toggle.Consumer>
      {(toggle) => (
        <nav>
          <ul>
            <li>
              <a href="index.html">{toggle.on ? '🏡' : 'Home'}</a>
            </li>
            <li>
              <a href="/about/">{toggle.on ? '❓' : 'About'}</a>
            </li>
            <li>
              <a href="/blog/">{toggle.on ? '📖' : 'Blog'}</a>
            </li>
          </ul>
        </nav>
      )}
    </Toggle.Consumer>
  )
}

function NavSwitch() {
  return (
    <div className="nav-switch">
      <div>
        <Toggle.Consumer>
          {(toggle) => (toggle.on ? '🦄' : 'Enable Emoji')}
        </Toggle.Consumer>
      </div>
      <Toggle.Consumer>
        {(toggle) => (
          <Switch
            {...toggle.getTogglerProps({
              on: toggle.on,
            })}
          />
        )}
      </Toggle.Consumer>
    </div>
  )
}

function Header() {
  return (
    <div className="header">
      <Nav />
      <NavSwitch />
    </div>
  )
}

function Subtitle() {
  return (
    <Toggle.Consumer>
      {(toggle) => (toggle.on ? '👩‍🏫 👉 🕶' : 'Teachers are awesome')}
    </Toggle.Consumer>
  )
}

function Title() {
  return (
    <div>
      <h1>
        <Toggle.Consumer>
          {(toggle) => `Who is ${toggle.on ? '🕶❓' : 'awesome?'}`}
        </Toggle.Consumer>
      </h1>
      <Subtitle />
    </div>
  )
}

function Article() {
  return (
    <div>
      <Toggle.Consumer>
        {(toggle) =>
          [
            'Once, I was in',
            toggle.on ? '🏫‍' : 'school',
            'when I',
            toggle.on ? '🤔' : 'realized',
            'something...',
          ].join(' ')
        }
      </Toggle.Consumer>
      <hr />
      <Toggle.Consumer>
        {(toggle) =>
          [
            'Without',
            toggle.on ? '👩‍🏫' : 'teachers',
            `I wouldn't know anything so`,
            toggle.on ? '🙏' : 'thanks',
            toggle.on ? '👩‍🏫❗️' : 'teachers!',
          ].join(' ')
        }
      </Toggle.Consumer>
    </div>
  )
}

function Post() {
>>>>>>> frontend-masters
  return (
    <Toggle onToggle={onToggle}>
      <Layer1 />
    </Toggle>
  )
}

/*
// without the changes you're going to make,
// this is what the usage would look like. You're looking at "prop drilling"

const Layer1 = ({on, toggle}) => <Layer2 on={on} toggle={toggle} />
const Layer2 = ({on, toggle}) => (
  <Fragment>
    {on ? 'The button is on' : 'The button is off'}
    <Layer3 on={on} toggle={toggle} />
  </Fragment>
)
const Layer3 = ({on, toggle}) => <Layer4 on={on} toggle={toggle} />
const Layer4 = ({on, toggle}) => <Switch on={on} onClick={toggle} />

function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      {({on, toggle}) => <Layer1 on={on} toggle={toggle} />}
    </Toggle>
  )
}
*/

Usage.title = 'The Provider Pattern'

export {Toggle, Usage as default}
