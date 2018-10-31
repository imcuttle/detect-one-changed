/**
 * @file Timer
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/31
 *
 */
import React from 'react'

export default class Timer extends React.Component {
  constructor(props, ctx) {
    super(props, ctx)
    this.state = {
      count: this.props.count || 1
    }
  }

  componentDidMount() {
    this._t = setInterval(() => {
      this.setState({ count: this.state.count + 1 })
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this._t)
    this._t = null
  }

  render() {
    return <div>Count: {this.state.count}</div>
  }
}
