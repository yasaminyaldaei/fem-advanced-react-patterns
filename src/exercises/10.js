// control props

import React from 'react'
import { Switch } from '../switch'

// Here we're going to simplify our component slightly so you
// can learn the control props pattern in isolation from everything else.
// Next you'll put the pieces together.

class Toggle extends React.Component {
<<<<<<< HEAD
  state = {on: false}
  // 🐨 let's add a function that can determine whether
  // the on prop is controlled. Call it `isControlled`.
  // It can accept a string called `prop` and should return
  // true if that prop is controlled
  // 💰 this.props[prop] !== undefined
  //
  // 🐨 Now let's add a function that can return the state
  // whether it's coming from this.state or this.props
  // Call it `getState` and have it return on from
  // state if it's not controlled or props if it is.
  toggle = () => {
    // 🐨 if the toggle is controlled, then we shouldn't
    // be updating state. Instead we should just call
    // `this.props.onToggle` with what the state should be
    this.setState(
      ({on}) => ({on: !on}),
      () => {
        this.props.onToggle(this.state.on)
      },
    )
=======
  static defaultProps = {
    initialOn: false,
    onReset: () => { },
    stateReducer: (state, changes) => changes,
    onToggle: () => { },
    onStateChange: () => { },
  }
  static stateChangeTypes = {
    reset: '__toggle_reset__',
    toggle: '__toggle_toggle__',
  }
  initialState = { on: this.props.initialOn }
  state = this.initialState

  isControlled(prop) {
    return this.props[prop] !== undefined
  }

  getState(state = this.state) {
    return Object.entries(state).reduce((newState, [key, value]) => {
      if (this.isControlled(key)) {
        newState[key] = this.props[key]
      } else {
        newState[key] = value
      }
      return newState
    }, {})
  }
  internalSetState(changes, callback) {
    let allChanges = {}
    this.setState(state => {
      const combinedState = this.getState(state)
      const changesObject =
        typeof changes === 'function' ? changes(combinedState) : changes
      allChanges =
        this.props.stateReducer(combinedState, changesObject) || {}

      const nonControlledChanges = Object.keys(combinedState).reduce((acc, stateKey) => {
        if (!this.isControlled(stateKey)) {
          acc[stateKey] = allChanges[stateKey]
        }
        return acc
      }, {})
      return Object.keys(nonControlledChanges).length ? nonControlledChanges : null

    }, () => {
      this.props.onStateChange(allChanges, this.getStateAndHelpers())
      callback()
    })
  }

  reset = () =>
    this.internalSetState(
      { ...this.initialState, type: Toggle.stateChangeTypes.reset },
      () => this.props.onReset(this.getState().on),
    )
  toggle = ({ type = Toggle.stateChangeTypes.toggle } = {}) =>
    this.internalSetState(
      ({ on }) => ({ type, on: !on }),
      () => this.props.onToggle(this.getState().on),
    )
  getTogglerProps = ({ onClick, ...props } = {}) => ({
    onClick: callAll(onClick, () => this.toggle()),
    'aria-expanded': this.getState().on,
    ...props,
  })
  getStateAndHelpers() {
    return {
      on: this.getState().on,
      toggle: this.toggle,
      reset: this.reset,
      getTogglerProps: this.getTogglerProps,
    }
>>>>>>> frontend-masters
  }
  render() {
    // 🐨 rather than getting state from this.state,
    // let's use our `getState` method.
    const {on} = this.state
    return <Switch on={on} onClick={this.toggle} />
  }
}

// These extra credit ideas are to expand this solution to elegantly handle
// more state properties than just a single `on` state.
// 💯 Make the `getState` function generic enough to support all state in
// `this.state` even if we add any number of properties to state.
// 💯 Add support for an `onStateChange` prop which is called whenever any
// state changes. It should be called with `changes` and `state`
// 💯 Add support for a `type` property in the `changes` you pass to
// `onStateChange` so consumers can differentiate different state changes.

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
class Usage extends React.Component {
<<<<<<< HEAD
  state = {bothOn: false}
  handleToggle = on => {
    this.setState({bothOn: on})
  }
  render() {
    const {bothOn} = this.state
    const {toggle1Ref, toggle2Ref} = this.props
    return (
      <div>
        <Toggle
          on={bothOn}
          onToggle={this.handleToggle}
          ref={toggle1Ref}
        />
        <Toggle
          on={bothOn}
          onToggle={this.handleToggle}
          ref={toggle2Ref}
        />
      </div>
=======
  static defaultProps = {
    onToggle: (...args) => console.log('onToggle', ...args),
    onReset: (...args) => console.log('onReset', ...args),
  }
  initialState = { timesClicked: 0, toggleOn: false }
  state = this.initialState
  handleStateChange = changes => {
    if (changes.type === 'forced') {
      this.setState({ toggleOn: changes.on }, () =>
        this.props.onToggle(this.state.toggleOn),
      )
    } else if (changes.type === Toggle.stateChangeTypes.reset) {
      this.setState(this.initialState, () => {
        this.props.onReset(this.state.toggleOn)
      })
    } else if (changes.type === Toggle.stateChangeTypes.toggle) {
      this.setState(
        ({ timesClicked }) => ({
          timesClicked: timesClicked + 1,
          toggleOn: timesClicked >= 4 ? false : changes.on,
        }),
        () => {
          this.props.onToggle(this.state.toggleOn)
        },
      )
    }
  }
  render() {
    const { timesClicked, toggleOn } = this.state
    return (
      <Toggle
        on={toggleOn}
        onStateChange={this.handleStateChange}
        ref={this.props.toggleRef}
      >
        {({ on, toggle, reset, getTogglerProps }) => (
          <div>
            <Switch
              {...getTogglerProps({
                on: on,
              })}
            />
            {timesClicked > 4 ? (
              <div data-testid="notice">
                Whoa, you clicked too much!
                <br />
                <button onClick={() => toggle({ type: 'forced' })}>
                  Force Toggle
                </button>
                <br />
              </div>
            ) : timesClicked > 0 ? (
              <div data-testid="click-count">
                Click count: {timesClicked}
              </div>
            ) : null}
            <button onClick={reset}>Reset</button>
          </div>
        )}
      </Toggle>
>>>>>>> frontend-masters
    )
  }
}
Usage.title = 'Control Props'

<<<<<<< HEAD
export {Toggle, Usage as default}
=======
export { Toggle, Usage as default }

/* eslint
"no-unused-vars": [
  "warn",
  {
    "argsIgnorePattern": "^_.+|^ignore.+",
    "varsIgnorePattern": "^_.+|^ignore.+",
    "args": "after-used"
  }
]
 */
>>>>>>> frontend-masters
