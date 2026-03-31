const e=`# Make A Sound Recorder In Flutter

A Simple and Beautiful Sound Recorder. Hello Hello.. mic check 1..2..3…GO!..

We all have definitely used a sound recorder before. Now it's time to make our own. You will also learn some new things along the way like how to store and delete files, etc. You'll see that there is so much going in the background of a simple sound recorder. We will also separate business logic and the UI. I will use Flutter Bloc but should work with any state management technique you like.

This project is also available on [GitHub](https://github.com/Manty-K/Rapid-Note).

---

## The Plan

The sound recorder should be as simple and sweet. We should get our work done with minimum taps as possible. For now, we will only make two screens.

1. HomeScreen (usually with a BIG mic in the middle, where we record)
2. Recordings List Screen (list all our recordings and hear them)

We need to start recording when the microphone button is pressed. Stop the recording when stop button is pressed. Save the file to a specific folder and hear our recordings.

---

## Packages I'll use

1. [**record**](https://pub.dev/packages/record) — To record through the microphone of our device
2. [**just_audio**](https://pub.dev/packages/just_audio) — To play our recordings
3. [**flutter_bloc**](https://pub.dev/packages/flutter_bloc) — To handle our app's state management
4. [**permission_handler**](https://pub.dev/packages/permission_handler) — To request and check necessary permissions

---

## Let's Code…

First we will look at record cubit and record state

When the user presses the microphone button startRecording() is called. Necessary permissions are first checked and recording is started.

Recordings are named with current milliseconds since epoch.

For Example: - 162722255734.rn

File type I have used is .rn, because I am naming this app as "Rapid Note". But you can use '.m4a' or any file type of your choice. After this process RecordOn state is emitted.

Advantage of using different file types is that our recordings will not be played while listening our favorite songs. Audio player does not have any problem as long as its codec is supported.

When pressed the stop button stopRecording() is called. RecordStopped state is emitted.

The amplitudeStream gives us the amplitude dB value in doubles ranging from roughly -40 (silent) to 0(loud). This will help us show the audio visualizer when the recording is on.

\`\`\`dart
// record_cubit.dart
import 'dart:async';
import 'dart:io';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:rapid_note/screens/recordings_list/cubit/files/files_cubit.dart';
import '../../../../constants/paths.dart';
import '../../../../constants/recorder_constants.dart';
import 'package:record/record.dart';
part 'record_state.dart';
class RecordCubit extends Cubit<RecordState> {
  RecordCubit() : super(RecordInitial());
  AudioRecorder _audioRecorder = AudioRecorder();
  void startRecording() async {
    Map<Permission, PermissionStatus> permissions = await [
      Permission.storage,
      Permission.microphone,
    ].request();
    bool permissionsGranted = permissions[Permission.storage]!.isGranted &&
        permissions[Permission.microphone]!.isGranted;
    if (permissionsGranted) {
      Directory appFolder = Directory(Paths.recording);
      bool appFolderExists = await appFolder.exists();
      if (!appFolderExists) {
        final created = await appFolder.create(recursive: true);
        print(created.path);
      }
      final filepath = Paths.recording +
          '/' +
          DateTime.now().millisecondsSinceEpoch.toString() +
          RecorderConstants.fileExtention;
      print(filepath);
      final config = RecordConfig();
      await _audioRecorder.start(config, path: filepath);
      emit(RecordOn());
    } else {
      print('Permissions not granted');
    }
  }
  void stopRecording() async {
    String? path = await _audioRecorder.stop();
    emit(RecordStopped());
    print('Output path $path');
  }
  Future<Amplitude> getAmplitude() async {
    final amplitude = await _audioRecorder.getAmplitude();
    return amplitude;
  }
  Stream<double> aplitudeStream() async* {
    while (true) {
      await Future.delayed(Duration(
          milliseconds: RecorderConstants.amplitudeCaptureRateInMilliSeconds));
      final ap = await _audioRecorder.getAmplitude();
      yield ap.current;
    }
  }
}
\`\`\`

\`\`\`dart
// record_state.dart
part of 'record_cubit.dart';
abstract class RecordState {}
class RecordInitial extends RecordState {}
class RecordOn extends RecordState {
  int min = 0;
  int sec = 0;
}
class RecordStopped extends RecordState {}
class RecordError extends RecordState {}
\`\`\`

Dart recognizes system files as FileSystemEntity. But we need more information of a recording file like its duration and the time it was recorded so we will create a Recording class. Since we are naming our files in milliseconds we can convert them to DateTime objects.

\`\`\`dart
// recording.dart
import 'dart:io';
import 'package:equatable/equatable.dart';
class Recording extends Equatable {
  final FileSystemEntity file;
  final Duration fileDuration;
  late final DateTime dateTime;
  Recording({
    required this.file,
    required this.fileDuration,
  }) {
    final millisecond = int.parse(file.path.split('/').last.split('.').first);
    dateTime = DateTime.fromMillisecondsSinceEpoch(millisecond);
  }
  @override
  List<Object?> get props => [file, fileDuration];
  @override
  bool? get stringify => true;
}
\`\`\`

Recordings also need to be grouped according to days to view recordings of separate days. We will create a RecordingGroup class with will contain a DateTime property and a list of Recording instances.

\`\`\`dart
// recording_group.dart
import 'package:equatable/equatable.dart';
import 'recording.dart';
class RecordingGroup extends Equatable {
  final DateTime date;
  final List<Recording> recordings;
  RecordingGroup({required this.date, required this.recordings});
  factory RecordingGroup.initial(Recording recording) {
    return RecordingGroup(date: recording.dateTime, recordings: [recording]);
  }
  addRecording(Recording recording) {
    recordings.add(recording);
  }
  @override
  List<Object?> get props => [date, recordings];
  @override
  bool? get stringify => true;
  RecordingGroup copyWith({
    DateTime? date,
    List<Recording>? recordings,
  }) {
    return RecordingGroup(
      date: date ?? this.date,
      recordings: recordings ?? this.recordings,
    );
  }
}
\`\`\`

Files cubit is used in recordings list screen. The getFiles() method is required to make instances of Recording and store them in state. If you wonder why we are using an audio player controller here. It's just to get the file duration. The setPath() method returns Duration?.

\`\`\`dart
// files_cubit.dart
class FilesCubit extends Cubit<FilesState> {
  FilesCubit() : super(FilesInitial()) {
    getFiles();
  }
  Future<void> getFiles() async {
    List<Recording> recordings = [];
    emit(FilesLoading());
    PermissionStatus permissionGranted = await Permission.storage.request();
    if (permissionGranted == PermissionStatus.granted) {
      final List<FileSystemEntity> files =
          Directory(Paths.recording).listSync();
      for (final file in files) {
        AudioPlayerController controller = AudioPlayerController();
        /// Used controller her just to get the duration on file using [setPath()]
        Duration? fileDuration = await controller.setPath(filePath: file.path);
        if (fileDuration != null) {
          recordings.add(Recording(file: file, fileDuration: fileDuration));
        }
      }
      emit(FilesLoaded(recordings: recordings));
    } else {
      emit(FilesPermisionNotGranted());
    }
  }
  removeRecording(Recording recording) {
    final recordings = (state as FilesLoaded)
        .recordings
        .where((element) => element != recording)
        .toList();
    emit(FilesLoaded(recordings: recordings));
  }
}
\`\`\`

Recordings are being stored as List<Recording> in the state. But we need them to be sorted according to dates to be able to view them nicely inside our screen. Here comes the sortedRecordings getter which returns RecordingGroups instances and does the work for us.

\`\`\`dart
// file_state.dart
part of 'files_cubit.dart';
abstract class FilesState {}
class FilesInitial extends FilesState {}
class FilesLoading extends FilesState {}
class FilesLoaded extends FilesState {
  final List<Recording> recordings;
  FilesLoaded({required this.recordings});
  List<RecordingGroup> get sortedRecordings {
    List<RecordingGroup> recordingGroups = [];
    final recordingsList = recordings;
    for (var i = 0; i < recordingsList.length; i++) {
      final selectedRecording = recordingsList[i];
      bool recordingAdded = false;
      for (var j = 0; j < recordingGroups.length; j++) {
        if (recordingGroups[j].recordings.any((recording) =>
            recording.dateTime.difference(selectedRecording.dateTime).inDays ==
            0)) {
          recordingGroups[j].addRecording(selectedRecording);
          recordingAdded = true;
        }
      }
      if (!recordingAdded) {
        recordingGroups.add(RecordingGroup.initial(selectedRecording));
      }
    }
    ///Sort inner recordings
    for (var group in recordingGroups) {
      group.recordings.sort((a, b) {
        return b.dateTime.compareTo(a.dateTime);
      });
    }
    ///Sort groups
    recordingGroups.sort((a, b) {
      return b.date.compareTo(a.date);
    });
    return recordingGroups;
  }
}
class FilesPermisionNotGranted extends FilesState {}
\`\`\`

Our backend word is almost done. To be able to hear our recording we need to create the Audio Player Controller class.

\`\`\`dart
// audio_player_controller.dart
import 'package:just_audio/just_audio.dart';
class AudioPlayerController {
  AudioPlayer _audioPlayer = AudioPlayer();
  Future<Duration?> setPath({required String filePath}) async {
    final duration = await _audioPlayer.setFilePath(filePath);
    return duration;
  }
  Future<void> play() async {
    await _audioPlayer.play();
  }
  Future<void> stop() async {
    await _audioPlayer.stop();
  }
  Stream<PlayerState> get playerState => _audioPlayer.playerStateStream;
  Future<void> dispose() async {
    await _audioPlayer.dispose();
  }
}
\`\`\`

All the backend work is done! Now it's time to work on the UI.

I will implement some Dark Neumorphic Design in the screens.

\`\`\`dart
// home_screen.dart
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../constants/app_colors.dart';
import '../../constants/recorder_constants.dart';
import 'widgets/audio_visualizer.dart';
import 'widgets/mic.dart';
import '../recordings_list/cubit/files/files_cubit.dart';
import '../recordings_list/view/recordings_list_screen.dart';
import '../../constants/concave_decoration.dart';
import 'cubit/record/record_cubit.dart';
class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);
  static const routeName = '/homescreen';
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.mainColor,
      body: BlocBuilder<RecordCubit, RecordState>(
        builder: (context, state) {
          if (state is RecordStopped || state is RecordInitial) {
            return SafeArea(
                child: Column(
              children: [
                SizedBox(height: 15),
                appTitle(),
                Spacer(),
                NeumorphicMic(onTap: () {
                  context.read<RecordCubit>().startRecording();
                }),
                Spacer(),
                GestureDetector(
                  onTap: () {
                    Navigator.push(context, _customRoute());
                  },
                  child: myNotes(),
                ),
                SizedBox(height: 15),
              ],
            ));
          } else if (state is RecordOn) {
            return SafeArea(
                child: Column(
              children: [
                SizedBox(height: 15),
                appTitle(),
                Spacer(),
                Row(
                  children: [
                    Spacer(),
                    StreamBuilder<double>(
                        initialData: RecorderConstants.decibleLimit,
                        stream: context.read<RecordCubit>().aplitudeStream(),
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            return AudioVisualizer(amplitude: snapshot.data);
                          }
                          if (snapshot.hasError) {
                            return Text(
                              'Visualizer failed to load',
                              style: TextStyle(color: AppColors.accentColor),
                            );
                          } else {
                            return SizedBox();
                          }
                        }),
                    Spacer(),
                  ],
                ),
                Spacer(),
                GestureDetector(
                  onTap: () {
                    context.read<RecordCubit>().stopRecording();
                    ///We need to refresh [FilesState] after recording is stopped
                    context.read<FilesCubit>().getFiles();
                  },
                  child: Container(
                    decoration: ConcaveDecoration(
                      shape: CircleBorder(),
                      depression: 10,
                      colors: [
                        AppColors.highlightColor,
                        AppColors.shadowColor,
                      ],
                    ),
                    child: Icon(
                      Icons.stop,
                      color: AppColors.accentColor,
                      size: 50,
                    ),
                    height: 100,
                    width: 100,
                  ),
                ),
                SizedBox(height: 15),
              ],
            ));
          } else {
            return Center(
                child: Text(
              'An Error occured',
              style: TextStyle(color: AppColors.accentColor),
            ));
          }
        },
      ),
    );
  }
  Text myNotes() {
    return Text(
      'MY NOTES',
      style: TextStyle(
          color: AppColors.accentColor,
          fontSize: 20,
          letterSpacing: 5,
          shadows: [
            Shadow(
                offset: Offset(3, 3),
                blurRadius: 5,
                color: Colors.black.withOpacity(0.2)),
          ]),
    );
  }
  Widget appTitle() {
    return Text(
      'RAPID NOTE',
      style: TextStyle(
          color: AppColors.accentColor,
          fontSize: 50,
          letterSpacing: 5,
          fontWeight: FontWeight.w200,
          shadows: [
            Shadow(
                offset: Offset(3, 3),
                blurRadius: 5,
                color: Colors.black.withOpacity(0.2)),
          ]),
    );
  }
  Route _customRoute() {
    return PageRouteBuilder(
      transitionDuration: Duration.zero,
      pageBuilder: (context, animation, secondaryAnimation) =>
          RecordingsListScreen(),
    );
  }
}
\`\`\`

When clicked on MY NOTES it will navigate to Recordings List Screen.

The Recordings list screen contains grouped recordings with record timing as their title and its duration in the trailing of the list tile. Recordings get deleted when swiped right or left using the Dismissible Widget.

\`\`\`dart
// recordings_list_screen.dart
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:just_audio/just_audio.dart';
import 'package:permission_handler/permission_handler.dart';
import '../../../constants/app_colors.dart';
import '../../../controller/audio_player_controller.dart';
import '../../../models/recording_group.dart';
import '../cubit/files/files_cubit.dart';
import 'widgets/playing_icons.dart';
class RecordingsListScreen extends StatefulWidget {
  static const routeName = '/recordingsList';
  @override
  _RecordingsListScreenState createState() => _RecordingsListScreenState();
}
class _RecordingsListScreenState extends State<RecordingsListScreen> {
  final AudioPlayerController controller = AudioPlayerController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.mainColor,
      body: BlocBuilder<FilesCubit, FilesState>(
        builder: (context, state) {
          if (state is FilesLoaded) {
            String _durationString(Duration duration) {
              String twoDigits(int n) => n.toString().padLeft(2, "0");
              String twoDigitMinutes =
                  twoDigits(duration.inMinutes.remainder(60));
              String twoDigitSeconds =
                  twoDigits(duration.inSeconds.remainder(60));
              return "$twoDigitMinutes:$twoDigitSeconds";
            }
            Widget buildGroup(RecordingGroup rGroup) {
              final currentTime = DateTime.now();
              final today = DateTime.utc(
                  currentTime.year, currentTime.month, currentTime.day);
              String title = '';
              int diffrence = rGroup.date.difference(today).inDays;
              if (diffrence == -1) {
                title = 'Yesterday';
              } else if (diffrence == 0) {
                title = 'Today';
              } else {
                title = getDateString(rGroup.date);
              }
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: AppColors.highlightColor,
                      fontSize: 40,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 5,
                    ),
                  ),
                  ...rGroup.recordings
                      .map((groupRecording) => Dismissible(
                            background: Container(color: AppColors.shadowColor),
                            onDismissed: (direction) async {
                              controller.stop();
                              final recording = state.recordings.firstWhere(
                                  (element) => element == groupRecording);
                              await recording.file.delete();
                              context
                                  .read<FilesCubit>()
                                  .removeRecording(recording);
                            },
                            key: Key(groupRecording.fileDuration.toString()),
                            child: Padding(
                              padding: EdgeInsets.symmetric(vertical: 10),
                              child: ListTile(
                                selectedTileColor: Colors.green,
                                title: Text(
                                  dateTimeToTimeString(groupRecording.dateTime),
                                  style: TextStyle(
                                    color: AppColors.accentColor,
                                    fontSize: 30,
                                    fontWeight: FontWeight.w200,
                                    letterSpacing: 5,
                                  ),
                                ),
                                trailing: Text(
                                  _durationString(groupRecording.fileDuration),
                                  style: TextStyle(
                                    color: AppColors.accentColor,
                                    letterSpacing: 2,
                                    fontWeight: FontWeight.w100,
                                  ),
                                ),
                                onTap: () async {
                                  await controller.stop();
                                  await controller.setPath(
                                      filePath: groupRecording.file.path);
                                  await controller.play();
                                  await controller.stop();
                                },
                              ),
                            ),
                          ))
                      .toList()
                ],
              );
            }
            if (state.sortedRecordings.isNotEmpty) {
              return SafeArea(
                child: SingleChildScrollView(
                  physics: BouncingScrollPhysics(),
                  child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      children: state.sortedRecordings
                          .map((RecordingGroup recordingGroup) {
                        if (recordingGroup.recordings.isNotEmpty) {
                          return buildGroup(recordingGroup);
                        } else {
                          return SizedBox();
                        }
                      }).toList(),
                    ),
                  ),
                ),
              );
            } else {
              return Center(
                child: Text(
                  'You have not recorded any notes',
                  style: TextStyle(color: AppColors.accentColor),
                ),
              );
            }
          } else if (state is FilesLoading) {
            return Center(
                child: CircularProgressIndicator(
              color: AppColors.accentColor,
            ));
          } else if (state is FilesPermisionNotGranted) {
            return Center(
              child: Column(
                children: [
                  Spacer(),
                  Text('You need to allow storage permision to view recordngs'),
                  ElevatedButton(
                    onPressed: () async {
                      bool permantlyDenied =
                          await Permission.storage.isPermanentlyDenied;
                      print('Permantly denied $permantlyDenied');
                      if (permantlyDenied) {
                        await openAppSettings();
                      } else {
                        await Permission.storage.request();
                      }
                      await context.read<FilesCubit>().getFiles();
                    },
                    child: Text('Allow Permission'),
                  ),
                  Spacer(),
                ],
              ),
            );
          } else {
            return Center(
              child: Text('Error'),
            );
          }
        },
      ),
      bottomNavigationBar: playingIndicator(),
    );
  }
  String getDateString(DateTime dateTime) {
    String day = dateTime.day.toString();
    String month = '';
    switch (dateTime.month) {
      case 1:
        month = 'January';
        break;
      case 2:
        month = 'February';
        break;
      case 3:
        month = 'March';
        break;
      case 4:
        month = 'April';
        break;
      case 5:
        month = 'May';
        break;
      case 6:
        month = 'June';
        break;
      case 7:
        month = 'July';
        break;
      case 8:
        month = 'August';
        break;
      case 9:
        month = 'September';
        break;
      case 10:
        month = 'October';
        break;
      case 11:
        month = 'Novenber';
        break;
      case 12:
        month = 'December';
        break;
    }
    return '$day $month';
  }
  String dateTimeToTimeString(DateTime dateTime) {
    bool isPM = false;
    int hour = dateTime.hour;
    int min = dateTime.minute;
    if (hour > 12) {
      isPM = true;
      hour -= 12;
    }
    return '\${hour.toString().padLeft(2, '0')}:\${min.toString().padLeft(2, '0')} \${isPM ? 'pm' : 'am'}';
  }
  Widget playingIndicator() {
    final double borderRadius = 40;
    return GestureDetector(
      onTap: () {
        controller.stop();
      },
      child: Container(
        alignment: Alignment.center,
        height: 80,
        decoration: BoxDecoration(
            color: AppColors.mainColor,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(borderRadius),
              topRight: Radius.circular(borderRadius),
            ),
            boxShadow: [
              BoxShadow(
                offset: Offset(0, -5),
                blurRadius: 10,
                color: Colors.black26,
              ),
            ]),
        child: StreamBuilder<PlayerState>(
          stream: controller.playerState,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              if (snapshot.data!.playing) {
                return PlayingIcon();
              } else {
                return PlayingIcon.idle();
              }
            } else {
              return Text('Stopped');
            }
          },
        ),
      ),
    );
  }
  @override
  void dispose() {
    controller.stop();
    controller.dispose();
    super.dispose();
  }
}
\`\`\`

When the waveform at the bottom nav bar is clicked the recording is stopped.

This is how we can create a basic sound recording app in Flutter.

Thank You for reading this. I have tried my best to keep it short. Feel free to contribute to this project and help others. Happy Fluttering!

You can check out the [Github Repo](https://github.com/Manty-K/Rapid-Note) of this project.

Follow me on [Linkedin](https://www.linkedin.com/in/manthan-khandale-5b218244/)
`;export{e as default};
