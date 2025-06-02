/**
 * 🎨 LESSON 5: Advanced UI Components - Animated Message
 * 
 * This component wraps messages with beautiful entrance animations.
 * Features:
 * 1. Smooth fade-in and slide-up animation
 * 2. Different animations for user vs assistant messages
 * 3. Staggered animation timing for multiple messages
 * 4. Bounce effect for a playful feel
 * 
 * Think of this as bringing messages to life!
 */
import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
interface AnimatedMessageProps {
  children: React.ReactNode;
  isUser: boolean;
  delay?: number;
  style?: ViewStyle;
}
export const AnimatedMessage: React.FC<AnimatedMessageProps> = ({
  children,
  isUser,
  delay = 0,
  style
}) => {
  // 🎭 ANIMATION VALUES: Create animated values for smooth transitions
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  // 🎬 ENTRANCE ANIMATION: Beautiful message appearance
  useEffect(() => {
    // Create a sequence of animations for a polished effect
    const animationSequence = Animated.parallel([
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true}),
      // Slide up animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true}),
      // Scale animation with bounce
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: delay + 100,
        tension: 100,
        friction: 8,
        useNativeDriver: true}),
    ]);
    // Start the animation
    animationSequence.start();
  }, []);
  // 🎨 ANIMATION STYLES: Combine all animated values
  const animatedStyle = {
    opacity: fadeAnim,
    transform: [
      {
        translateY: slideAnim},
      {
        scale: scaleAnim},
      // Add slight rotation for user messages to make them feel more dynamic
      ...(isUser ? [{
        rotate: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['2deg', '0deg']})}] : []),
    ]};
  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};
export default AnimatedMessage;
/**
 * 🎓 LEARNING NOTES:
 * 
 * 1. **Animated.parallel** - Runs multiple animations simultaneously
 * 2. **Animated.spring** - Creates bouncy, natural-feeling animations
 * 3. **interpolate** - Maps animation values to different ranges
 * 4. **useNativeDriver** - Runs animations on native thread for 60fps
 * 5. **Staggered delays** - Creates wave-like effects for multiple items
 * 
 * 🎯 UX PRINCIPLES APPLIED:
 * - **Delight** - Animations make the app feel alive and responsive
 * - **Feedback** - Users see their messages being "delivered"
 * - **Personality** - Different animations for user vs AI messages
 * - **Performance** - Native driver ensures smooth 60fps animations
 * 
 * 🚀 WHY THIS MATTERS:
 * - **User Engagement** - Smooth animations keep users interested
 * - **Perceived Quality** - Polished animations make apps feel premium
 * - **Emotional Connection** - Delightful interactions build user loyalty
 * - **Modern Feel** - Matches expectations from top-tier apps
 */
