// Control Props + with a state reducer

import React from 'react'
import { Switch } from '../switch'

const callAll = (...fns) => (...args) =>
  fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
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
  }
  render() {
    return this.props.children(this.getStateAndHelpers())
  }
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
class Usage extends React.Component {
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
    )
  }
}
Usage.title = 'Control Props with State Reducers'

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
