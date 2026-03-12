# Fade Widgets in Flutter

Give your widgets a Faded Effect.

---

Let's say we want to fade a widget called `WidgetToBeFaded()`.

We need to wrap it inside a `ShaderMask()` widget. Return `LinearGradient().createShader(bounds)` inside the `shaderCallback` function.

```dart
ShaderMask(
  shaderCallback: (Rect bounds) {
    return LinearGradient(
      colors: [Colors.black, Colors.transparent],
    ).createShader(bounds);
  },
  blendMode: BlendMode.dstIn,
  child: WidgetToBeFaded(),
)
```

In `LinearGradient`, use **Black** and a **Transparent** color. Set the blend mode of `ShaderMask` to `BlendMode.dstIn`.

We're done! Now the transparency of the widget is determined by the `LinearGradient`'s transparent color.

---

I hope this helps. Thanks for reading! 🙏
