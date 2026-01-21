// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ImageUp, Mic, Send, Square, X } from 'lucide-react';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ChatInputProps,
//   ImageFile,
//   SpeechRecognitionConstructor,
// } from './types';

// const ChatInput: React.FC<ChatInputProps> = ({
//   inputValue,
//   disabled,
//   onChange,
//   onSendMessage,
//   onKeyPress,
// }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [isSupported, setIsSupported] = useState(false);
//   const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
//   const recognitionRef = useRef<SpeechRecognition | null>(null);
//   const isRecordingRef = useRef(false);
//   const finalTranscriptRef = useRef('');
//   const initializedRef = useRef(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     // Check if Speech Recognition is supported
//     if (typeof window === 'undefined' || initializedRef.current) {
//       return;
//     }

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     let timeoutId: NodeJS.Timeout | null = null;

//     if (!SpeechRecognition) {
//       // isSupported is already false by default, no need to set it
//       initializedRef.current = true;
//       return;
//     }

//     // Defer setState to avoid cascading renders
//     timeoutId = setTimeout(() => {
//       setIsSupported(true);
//     }, 0);

//     // Initialize Speech Recognition
//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';

//     recognition.onresult = (event: SpeechRecognitionEvent) => {
//       let interimTranscript = '';

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const result = event.results[i];
//         const alternative = result[0];
//         if (alternative) {
//           const transcript = alternative.transcript;
//           if (result.isFinal) {
//             finalTranscriptRef.current += transcript + ' ';
//           } else {
//             interimTranscript += transcript;
//           }
//         }
//       }

//       setTranscript(finalTranscriptRef.current + interimTranscript);
//     };

//     recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
//       console.error('Speech recognition error:', event.error);
//       if (event.error === 'no-speech' || event.error === 'aborted') {
//         // Auto-stop if no speech detected or aborted
//         if (isRecordingRef.current) {
//           recognition.stop();
//           setIsRecording(false);
//           isRecordingRef.current = false;
//         }
//       }
//     };

//     recognition.onend = () => {
//       if (isRecordingRef.current) {
//         // Restart if still recording (handles auto-stop scenarios)
//         try {
//           recognition.start();
//         } catch (error) {
//           // Ignore errors when restarting
//         }
//       }
//     };

//     recognitionRef.current = recognition;
//     initializedRef.current = true;

//     return () => {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   const startRecording = () => {
//     if (!recognitionRef.current) return;

//     try {
//       finalTranscriptRef.current = '';
//       setTranscript('');
//       setIsRecording(true);
//       isRecordingRef.current = true;
//       recognitionRef.current.start();
//     } catch (error) {
//       console.error('Error starting speech recognition:', error);
//       setIsRecording(false);
//       isRecordingRef.current = false;
//     }
//   };

//   const stopRecording = () => {
//     if (!recognitionRef.current) return;

//     try {
//       recognitionRef.current.stop();
//       setIsRecording(false);
//       isRecordingRef.current = false;

//       // Set the transcript to the input
//       const finalText = finalTranscriptRef.current.trim() || transcript.trim();
//       if (finalText) {
//         const syntheticEvent = {
//           target: { value: finalText },
//         } as React.ChangeEvent<HTMLInputElement>;
//         onChange(syntheticEvent);
//       }

//       finalTranscriptRef.current = '';
//       setTranscript('');
//     } catch (error) {
//       console.error('Error stopping speech recognition:', error);
//       setIsRecording(false);
//       isRecordingRef.current = false;
//     }
//   };

//   const handleMicClick = () => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   };

//   const handleImageUpload = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const selectedImageFiles = Array.from(files).filter((file) =>
//       file.type.startsWith('image/'),
//     );

//     if (selectedImageFiles.length === 0) return;

//     // Calculate how many files we can add (max 5 total)
//     const currentCount = imageFiles.length;
//     const remainingSlots = 5 - currentCount;
//     const filesToAdd = selectedImageFiles.slice(0, remainingSlots);

//     if (filesToAdd.length === 0) {
//       // Already at max capacity
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//       return;
//     }

//     // Create ImageFile objects with both File and preview URL
//     const newImageFiles: ImageFile[] = filesToAdd.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));

//     setImageFiles((prev) => [...prev, ...newImageFiles]);

//     // Reset input value to allow selecting the same file again
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleRemoveImage = (indexToRemove: number) => {
//     setImageFiles((prev) => {
//       const imageToRemove = prev[indexToRemove];
//       // Revoke ObjectURL before removing
//       if (imageToRemove?.preview) {
//         URL.revokeObjectURL(imageToRemove.preview);
//       }
//       return prev.filter((_, index) => index !== indexToRemove);
//     });
//   };

//   // Cleanup ObjectURLs on unmount
//   useEffect(() => {
//     return () => {
//       imageFiles.forEach((imageFile) => {
//         URL.revokeObjectURL(imageFile.preview);
//       });
//     };
//   }, [imageFiles]);

//   return (
//     <div className="flex-1 flex flex-col items-center">
//       {imageFiles.length > 0 && (
//         <div className="media-preview w-full py-2 items-start flex gap-2 flex-wrap">
//           {imageFiles.map((imageFile, index) => (
//             <div key={index} className="relative">
//               <img
//                 src={imageFile.preview}
//                 alt={`Preview ${index + 1}`}
//                 className="w-[60px] h-[60px] rounded-md object-cover"
//               />
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-500 hover:bg-destructive/90 p-0"
//                 onClick={() => handleRemoveImage(index)}
//                 type="button"
//               >
//                 <X className="size-3 text-white" />
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}
//       <div className="relative gap-2 flex w-full items-center">
//         {/* Upload button */}
//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8"
//           disabled={isRecording}
//           onClick={handleImageUpload}
//           type="button"
//         >
//           <ImageUp className="size-4 text-[#9299a5]" />
//         </Button>
//         <div className="relative flex items-center flex-1">
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleFileChange}
//             className="hidden"
//           />
//           {!isRecording ? (
//             <Input
//               value={inputValue}
//               onChange={onChange}
//               onKeyPress={onKeyPress}
//               placeholder="Pour your heart out here ..."
//               className={`h-12! pl-8 relative z-10 w-full rounded-full text-sm border-0 bg-[#f8f9fa] backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/50 ${
//                 isSupported ? 'pr-12' : ''
//               }`}
//             />
//           ) : (
//             <div
//               className={`relative pl-9 h-12 z-10 w-full rounded-full border-0 bg-[#f8f9fa] backdrop-blur-sm flex items-center px-4 ${
//                 isSupported ? 'pr-12' : ''
//               }`}
//             >
//               <span className="text-sm text-muted-foreground">
//                 {transcript || 'Recording...'}
//               </span>
//             </div>
//           )}
//           {isSupported && (
//             <Button
//               variant="ghost"
//               size="icon"
//               className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8"
//               onClick={handleMicClick}
//               type="button"
//             >
//               {isRecording ? (
//                 <Square className="size-4 text-destructive" />
//               ) : (
//                 <Mic className="size-4 text-muted-foreground" />
//               )}
//             </Button>
//           )}
//         </div>
//         <div className="relative gap-2 flex items-center">
//           <Button
//             onClick={onSendMessage}
//             disabled={disabled}
//             className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12! px-6 shrink-0"
//           >
//             <Send className="size-4" />
//             Send
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInput;
