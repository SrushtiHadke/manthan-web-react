# Make A Sound Recorder In Flutter

A Simple and Beautiful Sound Recorder. Hello Hello.. mic check 1..2..3…GO!

We all have definitely used a sound recorder before. Now it's time to make our own. You will also learn some new things along the way like how to store and delete files, etc. You'll see that there is so much going on in the background of a simple sound recorder. We will also separate business logic and the UI. I will use Flutter Bloc but it should work with any state management technique you like.

---

## The Plan

The sound recorder should be simple and sweet — get the work done with minimum taps. We will make two screens:

1. **HomeScreen** — usually with a BIG mic in the middle, where we record
2. **Recordings List Screen** — list all our recordings and hear them

We need to start recording when the microphone button is pressed, stop recording when the stop button is pressed, save the file to a specific folder, and hear our recordings.

---

## Packages

1. **record** — To record through the microphone of our device
2. **just_audio** — To play our recordings
3. **flutter_bloc** — To handle our app's state management
4. **permission_handler** — To request and check necessary permissions

---

## Let's Code…

### Record State

```dart
abstract class RecordState {}

class RecordInitial extends RecordState {}

class RecordOn extends RecordState {
  final Stream<Amplitude> amplitudeStream;
  RecordOn({required this.amplitudeStream});
}

class RecordStopped extends RecordState {
  final String filePath;
  RecordStopped({required this.filePath});
}
```

### Record Cubit

When the user presses the microphone button, `startRecording()` is called. Necessary permissions are first checked and recording is started.

Recordings are named with current milliseconds since epoch — for example: `162722255734.rn`

The file type used is `.rn` because this app is named **Rapid Note**. But you can use `.m4a` or any file type of your choice. After this process, `RecordOn` state is emitted.

> **Advantage of using different file types:** Our recordings will not be played while listening to favorite songs. The audio player has no problem as long as its codec is supported.

When the stop button is pressed, `stopRecording()` is called and `RecordStopped` state is emitted.

```dart
class RecordCubit extends Cubit<RecordState> {
  final Record _recorder = Record();

  RecordCubit() : super(RecordInitial());

  Future<void> startRecording() async {
    final micPermission = await Permission.microphone.request();
    final storagePermission = await Permission.storage.request();

    if (micPermission.isGranted && storagePermission.isGranted) {
      final dir = await getApplicationDocumentsDirectory();
      final fileName = '${DateTime.now().millisecondsSinceEpoch}.rn';
      final filePath = '${dir.path}/$fileName';

      await _recorder.start(path: filePath);
      emit(RecordOn(amplitudeStream: _recorder.onAmplitudeChanged(
        const Duration(milliseconds: 100),
      )));
    }
  }

  Future<void> stopRecording() async {
    final path = await _recorder.stop();
    if (path != null) {
      emit(RecordStopped(filePath: path));
    }
  }

  @override
  Future<void> close() {
    _recorder.dispose();
    return super.close();
  }
}
```

### Amplitude Stream

The `amplitudeStream` gives us the amplitude dB value in doubles ranging from roughly `-40` (silent) to `0` (loud). This helps show the audio visualizer when recording is on.

---

### Recording Class

Dart recognizes system files as `FileSystemEntity`. But we need more information about a recording file like its duration and the time it was recorded — so we create a `Recording` class. Since files are named in milliseconds, we can convert them to `DateTime` objects.

```dart
class Recording {
  final String path;
  final String name;
  final DateTime dateTime;
  final Duration duration;

  Recording({
    required this.path,
    required this.name,
    required this.dateTime,
    required this.duration,
  });

  factory Recording.fromFile(FileSystemEntity file, Duration duration) {
    final name = file.path.split('/').last;
    final millis = int.parse(name.replaceAll('.rn', ''));
    return Recording(
      path: file.path,
      name: name,
      dateTime: DateTime.fromMillisecondsSinceEpoch(millis),
      duration: duration,
    );
  }
}
```

Recordings also need to be grouped by days to view recordings from separate days. We create a `RecordingGroup` class with a `DateTime` property and a list of `Recording` instances.

```dart
class RecordingGroup {
  final DateTime date;
  final List<Recording> recordings;

  RecordingGroup({required this.date, required this.recordings});
}
```

---

### Files Cubit

Files cubit is used in the Recordings List Screen. The `getFiles()` method creates instances of `Recording` and stores them in state. The audio player controller is used here just to get the file duration via `setPath()` which returns `Duration?`.

```dart
class FilesState {
  final List<Recording> recordings;
  FilesState({required this.recordings});

  List<RecordingGroup> get sortedRecordings {
    final Map<String, List<Recording>> grouped = {};
    for (final r in recordings) {
      final key = DateFormat('yyyy-MM-dd').format(r.dateTime);
      grouped.putIfAbsent(key, () => []).add(r);
    }
    return grouped.entries.map((e) => RecordingGroup(
      date: DateTime.parse(e.key),
      recordings: e.value..sort((a, b) => b.dateTime.compareTo(a.dateTime)),
    )).toList()
      ..sort((a, b) => b.date.compareTo(a.date));
  }
}

class FilesCubit extends Cubit<FilesState> {
  FilesCubit() : super(FilesState(recordings: []));

  Future<void> getFiles() async {
    final dir = await getApplicationDocumentsDirectory();
    final files = dir.listSync().where((f) => f.path.endsWith('.rn')).toList();
    final player = AudioPlayer();
    final List<Recording> recordings = [];

    for (final file in files) {
      await player.setFilePath(file.path);
      final duration = player.duration ?? Duration.zero;
      recordings.add(Recording.fromFile(file, duration));
    }

    await player.dispose();
    emit(FilesState(recordings: recordings));
  }
}
```

Recordings are stored as `List<Recording>` in state, sorted by dates using the `sortedRecordings` getter which returns `RecordingGroup` instances.

---

### Audio Player Controller

To hear our recordings, we create the `AudioPlayerController` class:

```dart
class AudioPlayerController {
  final AudioPlayer _player = AudioPlayer();

  Stream<PlayerState> get playerStateStream => _player.playerStateStream;
  Stream<Duration?> get positionStream => _player.positionStream;

  Future<void> play(String path) async {
    await _player.setFilePath(path);
    await _player.play();
  }

  Future<void> pause() async => await _player.pause();

  Future<void> stop() async => await _player.stop();

  void dispose() => _player.dispose();
}
```

---

## The UI

The design uses a **Dark Neumorphic** style.

- **HomeScreen** — Big mic button in the center. Clicking **MY NOTES** navigates to the Recordings List Screen.
- **Recordings List Screen** — Grouped recordings with record timing as title and duration in the trailing of the list tile. Recordings get deleted when swiped left or right using the `Dismissible` widget.
- When the waveform at the bottom nav bar is clicked, the recording is stopped.

---

## Wrapping Up

This is how we can create a basic sound recording app in Flutter. Feel free to contribute to the project and help others.

Happy Fluttering! 🐦
