import React, { useEffect, useRef } from 'react';
import './FlyToCart.css'; // Make sure this path is correct

const FlyToCart = ({ startPos, endPos, image, onAnimationEnd }) => {
  const imgRef = useRef();

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Set starting position
    img.style.top = `${startPos.top}px`;
    img.style.left = `${startPos.left}px`;
    img.style.opacity = '1'; // Ensure it's visible at start

    // Force a reflow for animation
    img.getBoundingClientRect();

    // Animate to cart position and fade out slightly
    img.style.top = `${endPos.top}px`;
    img.style.left = `${endPos.left}px`;
    img.style.opacity = '0.5'; // Fade out slightly at the end

    const handleTransitionEnd = () => {
      onAnimationEnd();
    };

    img.addEventListener('transitionend', handleTransitionEnd);
    return () => img.removeEventListener('transitionend', handleTransitionEnd);
  }, [startPos, endPos, onAnimationEnd]); // Add `image` to dependencies if image can change during animation

  return <img ref={imgRef} src={image} className="fly-to-cart-img" alt="Flying to cart" />;
};

export default FlyToCart;