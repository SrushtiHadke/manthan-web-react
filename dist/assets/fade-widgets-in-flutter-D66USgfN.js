const e=`# Fade Widgets in Flutter

Give your widgets a Faded Effect.

Let's say we want to fade a widget called WidgetToBeFaded().

We need to wrap it inside ShaderMask() widget. Return LinearGradient().createShader(bounds) inside shaderCallback function;

\`\`\`dart
ShaderMask(
  shaderCallback: (Rect bounds) {
    return LinearGradient(
      colors: [Colors.black, Colors.transparent],
    ).createShader(bounds);
  },
  blendMode: BlendMode.dstIn,
  child: WidgetToBeFaded(),
)
\`\`\`

In Linear Gradient use Black and a Transparent color. Set the blend mode of shader mask to BlendMode.dstIn.

We're done!! Now the transparency of widget is determined by the Linear Gradient's transparent color.

I hope this helps. Thanks for reading.

Follow me [GitHub](https://github.com/Manty-K), [LinkedIn](https://www.linkedin.com/in/manthan-khandale-5b218244/), [Twitter](https://x.com/KhandaleManthan).
`;export{e as default};
