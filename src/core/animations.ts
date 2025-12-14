// src/core/animations.ts
import {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideInUp,
  SlideInDown,
  SlideOutDown,
  withSpring,
  withTiming,
  Easing,
  Layout,
  FadeInUp,
  FadeInDown,
  withSequence,
  withDelay,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

// ============================================================================
// CONFIGURACIONES MATERIAL DESIGN - CONTAINER TRANSFORM
// ============================================================================

// Material Design Motion Easings
export const materialEasing = {
  // Standard easing - most common
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),
  // Decelerate easing - entering elements
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),
  // Accelerate easing - exiting elements
  accelerate: Easing.bezier(0.4, 0.0, 1, 1),
  // Emphasized easing - important transitions
  emphasized: Easing.bezier(0.05, 0.7, 0.1, 1.0),
  // Emphasized accelerate - emphasized exits
  emphasizedAccelerate: Easing.bezier(0.3, 0.0, 0.8, 0.15),
  // Emphasized decelerate - emphasized enters
  emphasizedDecelerate: Easing.bezier(0.05, 0.7, 0.1, 1.0),
};

// Material Design Duration Tokens
export const materialDuration = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  extraLong1: 700,
  extraLong2: 800,
  extraLong3: 900,
  extraLong4: 1000,
};

// Spring configs optimizados para Container Transform
// Basados en Material Design motion specifications
export const springConfig = {
  // Gentle - Para transiciones suaves y delicadas
  gentle: { damping: 20, stiffness: 90, mass: 0.8 },
  // Smooth - Para la mayoría de transiciones (recomendado)
  smooth: { damping: 18, stiffness: 180, mass: 0.5 },
  // Bouncy - Para feedback táctil con rebote sutil
  bouncy: { damping: 15, stiffness: 250, mass: 0.4 },
  // Snappy - Para respuestas inmediatas
  snappy: { damping: 20, stiffness: 300, mass: 0.4 },
};

export const timingConfig = {
  fast: { duration: materialDuration.short4, easing: materialEasing.standard },
  normal: { duration: materialDuration.medium2, easing: materialEasing.standard },
  slow: { duration: materialDuration.long1, easing: materialEasing.standard },
  gentle: { duration: materialDuration.medium3, easing: materialEasing.emphasized },
};

// ============================================================================
// ANIMACIONES DE TRANSICIÓN DE PANTALLA - CONTAINER TRANSFORM
// ============================================================================

/**
 * Container Transform - Transición hacia adelante (push)
 * Usa Material Design emphasized decelerate easing
 */
export const screenTransition = {
  entering: SlideInRight
    .duration(materialDuration.medium4)
    .easing(materialEasing.emphasizedDecelerate),
  exiting: FadeOut
    .duration(materialDuration.short4)
    .easing(materialEasing.accelerate),
};

/**
 * Container Transform - Transición hacia atrás (pop)
 * Usa Material Design emphasized accelerate easing
 */
export const screenTransitionBack = {
  entering: FadeIn
    .duration(materialDuration.short4)
    .easing(materialEasing.decelerate),
  exiting: SlideOutLeft
    .duration(materialDuration.medium4)
    .easing(materialEasing.emphasizedAccelerate),
};

// ============================================================================
// ANIMACIONES DE ENTRADA - CONTAINER TRANSFORM PATTERN
// ============================================================================

/**
 * Container Transform - Animación de entrada escalonada para cards en grid
 * Material Design's Container Transform con cascade effect
 *
 * @param index - Índice del elemento (0-based)
 * @param baseDelay - Delay inicial en ms (default: 40)
 * @param stagger - Incremento de delay por elemento (default: 25)
 *
 * Características:
 * - Entrada desde abajo con fade
 * - Escala sutil (95% → 100%)
 * - Easing emphasize-decelerate para sensación premium
 * - Delays escalonados para efecto cascade
 */
export const staggeredCardEnter = (
  index: number,
  baseDelay: number = 40,
  stagger: number = 25
) => {
  const delay = baseDelay + index * stagger;

  return FadeInUp
    .duration(materialDuration.medium3) // 350ms
    .delay(delay)
    .easing(materialEasing.emphasizedDecelerate)
    .withInitialValues({
      transform: [{ translateY: 24 }, { scale: 0.94 }],
      opacity: 0,
    });
};

/**
 * Container Transform - Animación de entrada para headers
 *
 * Características:
 * - Entrada desde arriba (FadeInDown)
 * - Escala muy sutil (98% → 100%)
 * - Emphasized easing para destacar
 * - Sin delay para respuesta inmediata
 */
export const headerEnter = () => {
  return FadeInDown
    .duration(materialDuration.medium2) // 300ms
    .delay(0)
    .easing(materialEasing.emphasized)
    .withInitialValues({
      transform: [{ translateY: -20 }, { scale: 0.97 }],
      opacity: 0,
    });
};

/**
 * Container Transform - Navegación flotante
 *
 * Características:
 * - Slide desde abajo
 * - Decelerate easing para suavidad
 * - Optional delay para coordinar con otras animaciones
 */
export const floatingEnter = (delay: number = 0) => {
  return SlideInUp
    .duration(materialDuration.medium3) // 350ms
    .delay(delay)
    .easing(materialEasing.decelerate);
};

// ============================================================================
// ANIMACIONES DE SALIDA - CONTAINER TRANSFORM
// ============================================================================

/**
 * Container Transform - Salida de cards
 *
 * Características:
 * - Fade out rápido
 * - Accelerate easing (más rápido al final)
 * - Duración corta para transición fluida
 */
export const cardExit = () => {
  return FadeOut
    .duration(materialDuration.short4) // 200ms
    .easing(materialEasing.accelerate);
};

/**
 * Container Transform - Salida deslizando hacia abajo
 *
 * Características:
 * - Slide hacia abajo con fade
 * - Accelerate easing
 * - Usado para modals y overlays
 */
export const slideDownExit = () => {
  return SlideOutDown
    .duration(materialDuration.medium2) // 300ms
    .easing(materialEasing.accelerate);
};

// ============================================================================
// ANIMACIONES DE INTERACCIÓN (para useAnimatedStyle)
// ============================================================================

/**
 * Container Transform - Escala para press
 *
 * Características:
 * - Spring physics optimizado para feedback táctil
 * - Escala sutil (96% por defecto)
 * - Damping ajustado para respuesta inmediata
 */
export const pressScale = (targetScale: number = 0.96) => {
  return withSpring(targetScale, {
    damping: 15,
    stiffness: 250,
    mass: 0.4,
  });
};

/**
 * Container Transform - Escala de regreso a normal
 *
 * Características:
 * - Spring suave para release
 * - Bounce sutil para sensación premium
 */
export const releaseScale = () => {
  return withSpring(1, {
    damping: 18,
    stiffness: 180,
    mass: 0.5,
  });
};

/**
 * Container Transform - Fade para opacity
 *
 * Características:
 * - Standard easing para transiciones suaves
 * - Duración media (300ms) para feedback visual
 */
export const fadeOpacity = (target: number) => {
  return withTiming(target, {
    duration: materialDuration.medium2,
    easing: materialEasing.standard,
  });
};

// ============================================================================
// HELPERS PARA ANIMACIONES COMBINADAS
// ============================================================================

/**
 * Container Transform - Elementos de lista con cascade effect
 * Material Design cascade pattern
 */
export const listItemEnter = (index: number) => {
  const delay = Math.min(index * 25, 300); // Más rápido, cap at 300ms

  return FadeInUp.duration(300)
    .delay(delay)
    .easing(Easing.bezier(0.4, 0.0, 0.2, 1)) // Standard easing
    .withInitialValues({
      transform: [{ translateY: 15 }, { scale: 0.96 }],
      opacity: 0,
    });
};

/**
 * Container Transform - Entrada de modals y overlays
 *
 * Características:
 * - Fade in suave con decelerate easing
 * - Duración media para transición visible pero rápida
 * - Sin escala para mantener contexto
 */
export const modalEnter = () => {
  return FadeIn
    .duration(materialDuration.medium2) // 300ms
    .easing(materialEasing.decelerate);
};

/**
 * Container Transform - Salida de modals y overlays
 *
 * Características:
 * - Fade out rápido con accelerate easing
 * - Duración corta para cierre inmediato
 */
export const modalExit = () => {
  return FadeOut
    .duration(materialDuration.short4) // 200ms
    .easing(materialEasing.accelerate);
};
