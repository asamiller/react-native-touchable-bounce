import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Touchable,
} from 'react-native';

const EdgeInsetsPropType = PropTypes.shape({
  top: PropTypes.number,
  left: PropTypes.number,
  bottom: PropTypes.number,
  right: PropTypes.number
});

let PRESS_RETENTION_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

/*
 * Example of using the `TouchableMixin` to play well with other responder
 * locking views including `ScrollView`. `TouchableMixin` provides touchable
 * hooks (`this.touchableHandle*`) that we forward events to. In turn,
 * `TouchableMixin` expects us to implement some abstract methods to handle
 * interesting interactions such as `handleTouchablePress`.
 */
export default React.createClass({
  mixins: [Touchable.Mixin],

  propTypes: {
    onPress: PropTypes.func,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    // The function passed takes a callback to start the animation which should
    // be run after this onPress handler is done. You can use this (for example)
    // to update UI before starting the animation.
    onPressWithCompletion: PropTypes.func,
    // the function passed is called after the animation is complete
    onPressAnimationComplete: PropTypes.func,
    /**
     * When the scroll view is disabled, this defines how far your touch may
     * move off of the button, before deactivating the button. Once deactivated,
     * try moving it back and you'll see that the button is once again
     * reactivated! Move it back and forth several times while the scroll view
     * is disabled. Ensure you pass in a constant to reduce memory allocations.
     */
    pressRetentionOffset: EdgeInsetsPropType,
    /**
     * This defines how far your touch can start away from the button. This is
     * added to `pressRetentionOffset` when moving off of the button.
     * ** NOTE **
     * The touch area never extends past the parent view bounds and the Z-index
     * of sibling views always takes precedence if a touch hits two overlapping
     * views.
     */
    hitSlop: EdgeInsetsPropType,

    disabled: PropTypes.bool,
  },

  getInitialState() {
    return {
      ...this.touchableGetInitialState(),
      scale: new Animated.Value(1),
    };
  },

  bounceTo(value, velocity, bounciness, callback) {
    Animated.spring(this.state.scale, {
      toValue: value,
      velocity,
      bounciness,
    }).start(callback);
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn(e) {
    if (this.props.disabled) return;

    this.bounceTo(0.90, 0.1, 0);
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut(e) {
    if (this.props.disabled) return;

    this.bounceTo(1, 0.4, 0);
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandlePress(e) {
    if (this.props.disabled) return;

    let onPressWithCompletion = this.props.onPressWithCompletion;
    if (onPressWithCompletion) {
      onPressWithCompletion(() => {
        this.state.scale.setValue(0.93);
        this.bounceTo(1, 2, 10, this.props.onPressAnimationComplete);
      });
      return;
    }

    this.bounceTo(1, 2, 10, this.props.onPressAnimationComplete);
    this.props.onPress && this.props.onPress(e);
  },

  touchableGetPressRectOffset() {
    return this.props.pressRetentionOffset || PRESS_RETENTION_OFFSET;
  },

  touchableGetHitSlop() {
    return this.props.hitSlop;
  },

  touchableGetHighlightDelayMS() {
    return 0;
  },

  render() {
    return (
      <Animated.View
        {...this.props}
        style={[{transform: [{scale: this.state.scale}]}, this.props.style]}
        accessible={true}
        onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
        onResponderTerminationRequest={this.touchableHandleResponderTerminationRequest}
        onResponderGrant={this.touchableHandleResponderGrant}
        onResponderMove={this.touchableHandleResponderMove}
        onResponderRelease={this.touchableHandleResponderRelease}
        onResponderTerminate={this.touchableHandleResponderTerminate}>
        {this.props.children}
      </Animated.View>
    );
  }
});
