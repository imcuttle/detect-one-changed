/**
 * @file Timer
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/31
 *
 */
import * as React from 'react'

const Timer = React.lazy(() => import('./Timer'))

export default class WrapTimer extends React.Component {
  render() {
    return (
      <div>
        <h3>Wrap Timer</h3>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Timer count={10} />
        </React.Suspense>
      </div>
    )
  }
}
