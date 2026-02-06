# 🎨 Quick Reference - Premium Aqua-Blue Theme

## 🚀 **Instant Upgrades**

### **Replace Old Styles** → **New Premium Styles**

```jsx
// ❌ OLD (Boring)
<div className="bg-white p-6 rounded-lg border shadow">

// ✅ NEW (Premium)
<div className="card-premium p-6 hover-lift">
```

```jsx
// ❌ OLD
<h1 className="text-4xl font-bold text-gray-900">

// ✅ NEW  
<h1 className="text-4xl font-bold text-gradient">
```

```jsx
// ❌ OLD
<button className="px-6 py-3 bg-blue-600 text-white rounded">

// ✅ NEW
<button className="btn-primary">
```

---

## 🎨 **Color Classes**

### **Gradients (Backgrounds)**:
- `gradient-aqua-blue` - Cyan → Sky → Blue
- `gradient-aqua-teal` - Teal → Cyan
- `gradient-ocean` - Deep ocean blues
- `gradient-water` - Light water colors

### **Text Gradients**:
- `text-gradient` - Aqua-blue gradient text
- `text-gradient-aqua` - Pure aqua gradient

---

## 📦 **Card Styles**

```jsx
<div className="card-premium">        // Glass + aqua glow
<div className="card-gradient">       // Gradient background
<div className="glass">               // Light glassmorphism
<div className="glass-dark">          // Dark glassmorphism
```

---

## 🔘 **Buttons**

```jsx
<button className="btn-primary">      // Gradient aqua-blue
<button className="btn-secondary">    // Outlined aqua
```

---

## ✨ **Effects**

```jsx
<div className="hover-lift">          // Lift on hover
<div className="animate-float">       // Floating animation
<div className="animate-pulse-glow">  // Pulsing glow
<div className="shimmer">             // Shimmer effect
<div className="shadow-aqua">         // Aqua shadow
<div className="shadow-aqua-lg">      // Large aqua shadow
```

---

## 🎯 **Typography**

```jsx
<h1 className="text-premium">         // Space Grotesk bold
<p className="text-body">             // DM Sans regular
```

---

## 🏷️ **Badges**

```jsx
<span className="badge-aqua">New</span>
```

---

## 💡 **Pro Tips**

1. **Always use `card-premium`** for cards
2. **Add `hover-lift`** to interactive elements
3. **Use `text-gradient`** for important headings
4. **Apply `btn-primary`** to main CTAs
5. **Add `shadow-aqua`** for extra depth

---

## 🎨 **Example Component**

```jsx
<motion.div 
  whileHover={{ y: -4 }}
  className="card-premium p-6 hover-lift"
>
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 rounded-xl gradient-aqua-blue flex items-center justify-center shadow-aqua">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gradient">
      Title
    </h3>
  </div>
  <p className="text-body text-gray-600">
    Description text here
  </p>
  <button className="btn-primary mt-4">
    Action
  </button>
</motion.div>
```

---

**Quick Start**: Replace all `bg-white` with `card-premium` and all headings with `text-gradient`! 🚀
