// src/data/gameData.ts

export type GameLevel = {
  id: number;
  ayah_ar: string;
  missing_word: string;
  options: string[];
  translation: string;
  surah: string;
};

export const GAME_DATA: Record<number, GameLevel[]> = {
  1: [
    { id: 1, ayah_ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ ____", missing_word: "نَسْتَعِينُ", options: ["نَسْتَعِينُ", "نَسْجُدُ", "نَحْمَدُ"], translation: "You alone we worship and You alone we ask for help", surah: "Al-Fatihah" },
    { id: 2, ayah_ar: "قُلْ هُوَ اللَّهُ ____", missing_word: "أَحَدٌ", options: ["أَحَدٌ", "صَمَدٌ", "أَكْبَرُ"], translation: "Say, 'He is Allah, [who is] One'", surah: "Al-Ikhlas" },
    { id: 3, ayah_ar: "فَبِأَيِّ آلَاء رَبِّكُمَا ____", missing_word: "تُكَذِّبَانِ", options: ["تَشْكُرَانِ", "تُكَذِّبَانِ", "تَعْلَمَانِ"], translation: "Then which of the favors of your Lord will you deny?", surah: "Ar-Rahman" },
    { id: 4, ayah_ar: "إِنَّ مَعَ الْعُسْرِ ____", missing_word: "يُسْرًا", options: ["يُسْرًا", "صَبْرًا", "أَجْرًا"], translation: "Indeed, with hardship [will be] ease", surah: "Al-Sharh" },
    { id: 5, ayah_ar: "الْحَمْدُ لِلَّهِ رَبِّ ____", missing_word: "الْعَالَمِينَ", options: ["الْعَالَمِينَ", "النَّاسِ", "الْمُؤْمِنِينَ"], translation: "[All] praise is [due] to Allah, Lord of the worlds", surah: "Al-Fatihah" },
  ],
  2: [
    { id: 6, ayah_ar: "مِن شَرِّ الْوَسْوَاسِ ____", missing_word: "الْخَنَّاسِ", options: ["الْخَنَّاسِ", "النَّاسِ", "الْخَنَّاقِ"], translation: "From the evil of the retreating whisperer", surah: "An-Nas" },
    { id: 7, ayah_ar: "إِذَا جَاءَ نَصْرُ اللَّهِ ____", missing_word: "وَالْفَتْحُ", options: ["وَالْفَتْحُ", "وَالْفَوْزُ", "وَالْقُدْسُ"], translation: "When the victory of Allah has come and the conquest", surah: "An-Nasr" },
    { id: 8, ayah_ar: "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا ____", missing_word: "اللَّهَ", options: ["اللَّهَ", "النَّبِيَّ", "الرَّسُولَ"], translation: "And they were not commanded except to worship Allah", surah: "Al-Bayyinah" },
    { id: 9, ayah_ar: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ ____", missing_word: "الْفِيلِ", options: ["الْفِيلِ", "الْخَيْلِ", "النَّارِ"], translation: "Have you not seen how your Lord dealt with the companions of the elephant?", surah: "Al-Fil" },
    { id: 10, ayah_ar: "فَلْيَعْبُدُوا رَبَّ هَٰذَا ____", missing_word: "الْبَيْتِ", options: ["الْبَيْتِ", "الْمَسْجِدِ", "الْبَلَدِ"], translation: "Let them worship the Lord of this House", surah: "Quraish" },
  ],
  3: [
    { id: 11, ayah_ar: "إِنَّا أَعْطَيْنَاكَ ____", missing_word: "الْكَوْثَرَ", options: ["الْكَوْثَرَ", "الْجَنَّةَ", "الرَّحْمَةَ"], translation: "Indeed, We have granted you, [O Muhammad], al-Kawthar", surah: "Al-Kawthar" },
    { id: 12, ayah_ar: "وَتَوَاصَوْا بِالصَّبْرِ وَتَوَاصَوْا ____", missing_word: "بِالْمَرْحَمَةِ", options: ["بِالْمَرْحَمَةِ", "بِالْحَقِّ", "بِالشُّكْرِ"], translation: "And advised each other to patience and advised each other to compassion", surah: "Al-Balad" },
    { id: 13, ayah_ar: "فَأَمَّا الْيَتِيمَ فَلَا ____", missing_word: "تَقْهَرْ", options: ["تَقْهَرْ", "تَنْهَرْ", "تَظْلِمْ"], translation: "So as for the orphan, do not oppress [him]", surah: "Ad-Duha" },
    { id: 14, ayah_ar: "فَصَلِّ لِرَبِّكَ ____", missing_word: "وَانْحَرْ", options: ["وَانْحَرْ", "وَاشْكُرْ", "وَاسْجُدْ"], translation: "So pray to your Lord and sacrifice [to Him alone]", surah: "Al-Kawthar" },
    { id: 15, ayah_ar: "الَّذِي يُطْعِمُهُم مِّن ____", missing_word: "جُوعٍ", options: ["جُوعٍ", "خَوْفٍ", "تَعَبٍ"], translation: "Who has fed them, [saving them] from hunger", surah: "Quraish" },
  ],
  4: [
    { id: 16, ayah_ar: "وَإِلَىٰ رَبِّكَ ____", missing_word: "فَارْغَب", options: ["فَارْغَب", "فَاسْجُد", "فَاحْمَد"], translation: "And to your Lord direct [your] longing", surah: "Al-Sharh" },
    { id: 17, ayah_ar: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي ____", missing_word: "كَبَدٍ", options: ["كَبَدٍ", "أَحْسَنِ", "ضَعْفٍ"], translation: "We have certainly created man into hardship", surah: "Al-Balad" },
    { id: 18, ayah_ar: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ ____", missing_word: "الْقَدْرِ", options: ["الْقَدْرِ", "الْعِيدِ", "الْبَرَكَةِ"], translation: "Indeed, We sent the Qur'an down during the Night of Decree", surah: "Al-Qadr" },
    { id: 19, ayah_ar: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ ____", missing_word: "شَهْرٍ", options: ["شَهْرٍ", "يَوْمٍ", "عَامٍ"], translation: "The Night of Decree is better than a thousand months", surah: "Al-Qadr" },
    { id: 20, ayah_ar: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ ____", missing_word: "الْفَجْرِ", options: ["الْفَجْرِ", "الشَّمْسِ", "النُّورِ"], translation: "Peace it is until the emergence of dawn", surah: "Al-Qadr" },
  ],
  5: [
    { id: 21, ayah_ar: "وَرَفَعْنَا لَكَ ____", missing_word: "ذِكْرَكَ", options: ["ذِكْرَكَ", "قَدْرَكَ", "شَأْنَكَ"], translation: "And raised high for you your repute", surah: "Al-Sharh" },
    { id: 22, ayah_ar: "الَّذِي أَنقَضَ ____", missing_word: "ظَهْرَكَ", options: ["ظَهْرَكَ", "صَدْرَكَ", "عُمْرَكَ"], translation: "Which had weighed upon your back", surah: "Al-Sharh" },
    { id: 23, ayah_ar: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ ____", missing_word: "عَظِيمٍ", options: ["عَظِيمٍ", "كَرِيمٍ", "جَمِيلٍ"], translation: "And indeed, you are of a great moral character", surah: "Al-Qalam" },
    { id: 24, ayah_ar: "لَا أَعْبُدُ مَا ____", missing_word: "تَعْبُدُونَ", options: ["تَعْبُدُونَ", "تَعْلَمُونَ", "تَكْسِبُونَ"], translation: "I do not worship what you worship", surah: "Al-Kafirun" },
    { id: 25, ayah_ar: "لَكُمْ دِينُكُمْ وَلِيَ ____", missing_word: "دِينِ", options: ["دِينِ", "عَمَلِ", "سَبِيلِ"], translation: "For you is your religion, and for me is my religion", surah: "Al-Kafirun" },
  ],
  6: [
    { id: 26, ayah_ar: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي ____", missing_word: "خَلَقَ", options: ["خَلَقَ", "أَمَرَ", "عَلَّمَ"], translation: "Recite in the name of your Lord who created", surah: "Al-Alaq" },
    { id: 27, ayah_ar: "عَلَّمَ الْإِنسَانَ مَا لَمْ ____", missing_word: "يَعْلَمْ", options: ["يَعْلَمْ", "يَفْهَمْ", "يَقْرَأْ"], translation: "Taught man that which he knew not", surah: "Al-Alaq" },
    { id: 28, ayah_ar: "إِنَّ إِلَىٰ رَبِّكَ ____", missing_word: "الرُّجْعَىٰ", options: ["الرُّجْعَىٰ", "الْمُنْتَهَىٰ", "الْمَصِيرَ"], translation: "Indeed, to your Lord is the return", surah: "Al-Alaq" },
    { id: 29, ayah_ar: "كَلَّا لَا تُطِعْهُ وَاسْجُدْ ____", missing_word: "وَاقْتَرِب", options: ["وَاقْتَرِب", "وَاصْبِر", "وَاحْمَد"], translation: "No! Do not obey him. But prostrate and draw near", surah: "Al-Alaq" },
    { id: 30, ayah_ar: "فَإِذَا فَرَغْتَ ____", missing_word: "فَانصَبْ", options: ["فَانصَبْ", "فَاسْجُدْ", "فَادْعُ"], translation: "So when you have finished [your duties], then stand up [for worship]", surah: "Al-Sharh" },
  ],
  7: [
    { id: 31, ayah_ar: "وَالْعَصْرِ ، إِنَّ الْإِنسَانَ لَفِي ____", missing_word: "خُسْرٍ", options: ["خُسْرٍ", "سُرُورٍ", "تَعَبٍ"], translation: "By time, indeed, mankind is in loss", surah: "Al-Asr" },
    { id: 32, ayah_ar: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا ____", missing_word: "الصَّالِحَاتِ", options: ["الصَّالِحَاتِ", "الْخَيْرَاتِ", "الْمَعْرُوفَ"], translation: "Except those who have believed and done righteous deeds", surah: "Al-Asr" },
    { id: 33, ayah_ar: "وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا ____", missing_word: "بِالصَّبْرِ", options: ["بِالصَّبْرِ", "بِالْعِلْمِ", "بِالْبِرِّ"], translation: "And advised each other to truth and advised each other to patience", surah: "Al-Asr" },
    { id: 34, ayah_ar: "الَّذِي جَمَعَ مَالًا ____", missing_word: "وَعَدَّدَهُ", options: ["وَعَدَّدَهُ", "وَأَنْفَقَهُ", "وَخَزَنَهُ"], translation: "Who collects wealth and [continuously] counts it", surah: "Al-Humazah" },
    { id: 35, ayah_ar: "وَمَا أَدْرَاكَ مَا ____", missing_word: "الْحُطَمَةُ", options: ["الْحُطَمَةُ", "الْقَارِعَةُ", "الْجَحِيمُ"], translation: "And what can make you know what is the Consuming Fire?", surah: "Al-Humazah" },
  ],
  // Day 8 - Day 15
  8: [
    { id: 36, ayah_ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ ____", missing_word: "الْقَيُّومُ", options: ["الْقَيُّومُ", "الْعَظِيمُ", "الْكَرِيمُ"], translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence", surah: "Al-Baqarah (Ayatul Kursi)" },
    { id: 37, ayah_ar: "لَا تَأْخُذُهُ سِنَةٌ وَلَا ____", missing_word: "نَوْمٌ", options: ["نَوْمٌ", "تَعَبٌ", "غَفْلَةٌ"], translation: "Neither drowsiness overtakes Him nor sleep", surah: "Al-Baqarah" },
    { id: 38, ayah_ar: "مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا ____", missing_word: "بِإِذْنِهِ", options: ["بِإِذْنِهِ", "بِأَمْرِهِ", "بِحُكْمِهِ"], translation: "Who is it that can intercede with Him except by His permission?", surah: "Al-Baqarah" },
    { id: 39, ayah_ar: "وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا ____", missing_word: "شَاءَ", options: ["شَاءَ", "أَرَادَ", "قَدَّرَ"], translation: "And they encompass not a thing of His knowledge except for what He wills", surah: "Al-Baqarah" },
    { id: 40, ayah_ar: "وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ ____", missing_word: "وَالْأَرْضَ", options: ["وَالْأَرْضَ", "وَالْجِبَالَ", "وَالْبِحَارَ"], translation: "His Kursi extends over the heavens and the earth", surah: "Al-Baqarah" },
  ],
  9: [
    { id: 41, ayah_ar: "ذَٰلِكَ الْكِتَابُ لَا ____ فِيهِ", missing_word: "رَيْبَ", options: ["رَيْبَ", "شَكَّ", "خَوْفَ"], translation: "This is the Book about which there is no doubt", surah: "Al-Baqarah" },
    { id: 42, ayah_ar: "هُدًى ____", missing_word: "لِّلْمُتَّقِينَ", options: ["لِّلْمُتَّقِينَ", "لِّلنَّاسِ", "لِّلْعَالَمِينَ"], translation: "A guidance for those conscious of Allah", surah: "Al-Baqarah" },
    { id: 43, ayah_ar: "الَّذِينَ يُؤْمِنُونَ ____", missing_word: "بِالْغَيْبِ", options: ["بِالْغَيْبِ", "بِاللَّهِ", "بِالْيَوْمِ"], translation: "Who believe in the unseen", surah: "Al-Baqarah" },
    { id: 44, ayah_ar: "وَيُقِيمُونَ ____", missing_word: "الصَّلَاةَ", options: ["الصَّلَاةَ", "الْحَقَّ", "الْعَدْلَ"], translation: "And establish prayer", surah: "Al-Baqarah" },
    { id: 45, ayah_ar: "وَمِمَّا رَزَقْنَاهُمْ ____", missing_word: "يُنفِقُونَ", options: ["يُنفِقُونَ", "يَأْكُلُونَ", "يَشْكُرُونَ"], translation: "And spend out of what We have provided for them", surah: "Al-Baqarah" },
  ],
  10: [
    { id: 46, ayah_ar: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن ____", missing_word: "رَّبِّهِ", options: ["رَّبِّهِ", "اللَّهِ", "السَّمَاءِ"], translation: "The Messenger has believed in what was revealed to him from his Lord", surah: "Al-Baqarah" },
    { id: 47, ayah_ar: "كُلٌّ آمَنَ بِاللَّهِ ____", missing_word: "وَمَلَائِكَتِهِ", options: ["وَمَلَائِكَتِهِ", "وَرُسُلِهِ", "وَكُتُبِهِ"], translation: "All of them have believed in Allah and His angels", surah: "Al-Baqarah" },
    { id: 48, ayah_ar: "لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن ____", missing_word: "رُّسُلِهِ", options: ["رُّسُلِهِ", "عِبَادِهِ", "أَنْبِيَائِهِ"], translation: "We make no distinction between any of His messengers", surah: "Al-Baqarah" },
    { id: 49, ayah_ar: "وَقَالُوا سَمِعْنَا ____", missing_word: "وَأَطَعْنَا", options: ["وَأَطَعْنَا", "وَآمَنَّا", "وَاتَّبَعْنَا"], translation: "And they say, 'We hear and we obey'", surah: "Al-Baqarah" },
    { id: 50, ayah_ar: "غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ____", missing_word: "الْمَصِيرُ", options: ["الْمَصِيرُ", "الرُّجُوعُ", "الْمُنْتَهَى"], translation: "[We seek] Your forgiveness, our Lord, and to You is the [final] destination", surah: "Al-Baqarah" },
  ],
  11: [
    { id: 51, ayah_ar: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا ____", missing_word: "وُسْعَهَا", options: ["وُسْعَهَا", "جُهْدَهَا", "طَاقَتَهَا"], translation: "Allah does not charge a soul except [with that within] its capacity", surah: "Al-Baqarah" },
    { id: 52, ayah_ar: "لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ____", missing_word: "اكْتَسَبَتْ", options: ["اكْتَسَبَتْ", "فَعَلَتْ", "أَرَادَتْ"], translation: "It will have [the consequence of] what [good] it has gained, and it will bear what [evil] it has earned", surah: "Al-Baqarah" },
    { id: 53, ayah_ar: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ ____", missing_word: "أَخْطَأْنَا", options: ["أَخْطَأْنَا", "عَصَيْنَا", "ضَلَلْنَا"], translation: "Our Lord, do not impose blame upon us if we have forgotten or erred", surah: "Al-Baqarah" },
    { id: 54, ayah_ar: "رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن ____", missing_word: "قَبْلِنَا", options: ["قَبْلِنَا", "حَوْلِنَا", "بَعْدِنَا"], translation: "Our Lord, and lay not upon us a burden like that which You laid upon those before us", surah: "Al-Baqarah" },
    { id: 55, ayah_ar: "أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ ____", missing_word: "الْكَافِرِينَ", options: ["الْكَافِرِينَ", "الظَّالِمِينَ", "الْمُشْرِكِينَ"], translation: "You are our protector, so give us victory over the disbelieving people", surah: "Al-Baqarah" },
  ],
  12: [
    { id: 56, ayah_ar: "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ ____", missing_word: "الْكِتَابَ", options: ["الْكِتَابَ", "الْقُرْآنَ", "النُّورَ"], translation: "[All] praise is [due] to Allah, who has sent down upon His Servant the Book", surah: "Al-Kahf" },
    { id: 57, ayah_ar: "وَلَمْ يَجْعَل لَّهُ ____", missing_word: "عِوَجًا", options: ["عِوَجًا", "شَكًّا", "تَعَبًا"], translation: "And has not made therein any deviance", surah: "Al-Kahf" },
    { id: 58, ayah_ar: "قَيِّمًا لِّيُنذِرَ بَأْسًا ____", missing_word: "شَدِيدًا", options: ["شَدِيدًا", "كَبِيرًا", "عَظِيمًا"], translation: "[He has made it] straight to warn of severe punishment", surah: "Al-Kahf" },
    { id: 59, ayah_ar: "مِّن لَّدُنْهُ وَيُبَشِّرَ ____", missing_word: "الْمُؤْمِنِينَ", options: ["الْمُؤْمِنِينَ", "النَّاسَ", "الصَّابِرِينَ"], translation: "From Him and to give good tidings to the believers", surah: "Al-Kahf" },
    { id: 60, ayah_ar: "الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا ____", missing_word: "حَسَنًا", options: ["حَسَنًا", "كَبِيرًا", "عَظِيمًا"], translation: "Who do righteous deeds that they will have a good reward", surah: "Al-Kahf" },
  ],
  13: [
    { id: 61, ayah_ar: "مَّاكِثِينَ فِيهِ ____", missing_word: "أَبَدًا", options: ["أَبَدًا", "عَامًا", "طَوِيلًا"], translation: "In which they will remain forever", surah: "Al-Kahf" },
    { id: 62, ayah_ar: "إِنَّا جَعَلْنَا مَا عَلَى الْأَرْضِ ____ لَّهَا", missing_word: "زِينَةً", options: ["زِينَةً", "فِتْنَةً", "مَتَاعًا"], translation: "Indeed, We have made that which is on the earth adornment for it", surah: "Al-Kahf" },
    { id: 63, ayah_ar: "لِنَبْلُوَهُمْ أَيُّهُمْ أَحْسَنُ ____", missing_word: "عَمَلًا", options: ["عَمَلًا", "قَوْلًا", "خُلُقًا"], translation: "That We may test them as to which of them is best in deed", surah: "Al-Kahf" },
    { id: 64, ayah_ar: "أَمْ حَسِبْتَ أَنَّ أَصْحَابَ الْكَهْفِ ____", missing_word: "وَالرَّقِيمِ", options: ["وَالرَّقِيمِ", "وَالْجَبَلِ", "وَالْغَارِ"], translation: "Or have you thought that the companions of the cave and the inscription", surah: "Al-Kahf" },
    { id: 65, ayah_ar: "كَانُوا مِنْ آيَاتِنَا ____", missing_word: "عَجَبًا", options: ["عَجَبًا", "آيَةً", "نُورًا"], translation: "Were, among Our signs, a wonder?", surah: "Al-Kahf" },
  ],
  14: [
    { id: 66, ayah_ar: "إِذْ أَوَى الْفِتْيَةُ إِلَى ____", missing_word: "الْكَهْفِ", options: ["الْكَهْفِ", "الْجَبَلِ", "الْمَدِينَةِ"], translation: "[Mention] when the youths retreated to the cave", surah: "Al-Kahf" },
    { id: 67, ayah_ar: "فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ ____", missing_word: "رَحْمَةً", options: ["رَحْمَةً", "نَصْرًا", "عِلْمًا"], translation: "And said, 'Our Lord, grant us from Yourself mercy'", surah: "Al-Kahf" },
    { id: 68, ayah_ar: "وَهَيِّئْ لَنَا مِنْ أَمْرِنَا ____", missing_word: "رَشَدًا", options: ["رَشَدًا", "يُسْرًا", "فَرَجًا"], translation: "And prepare for us from our affair right guidance'", surah: "Al-Kahf" },
    { id: 69, ayah_ar: "فَضَرَبْنَا عَلَىٰ آذَانِهِمْ فِي الْكَهْفِ سِنِينَ ____", missing_word: "عَدَدًا", options: ["عَدَدًا", "طَوِيلَةً", "كَثِيرَةً"], translation: "So We cast [a cover of sleep] over their ears within the cave for a number of years", surah: "Al-Kahf" },
    { id: 70, ayah_ar: "ثُمَّ بَعَثْنَاهُمْ لِنَعْلَمَ أَيُّ الْحِزْبَيْنِ أَحْصَىٰ لِمَا لَبِثُوا ____", missing_word: "أَمَدًا", options: ["أَمَدًا", "زَمَانًا", "وَقْتًا"], translation: "Then We awakened them that We might know which of the two factions was best at calculating", surah: "Al-Kahf" },
  ],
  15: [
    { id: 71, ayah_ar: "نَّحْنُ نَقُصُّ عَلَيْكَ نَبَأَهُم ____", missing_word: "بِالْحَقِّ", options: ["بِالْحَقِّ", "بِالتَّفْصِيلِ", "بِالصِّدْقِ"], translation: "It is We who relate to you, [O Muhammad], their story in truth", surah: "Al-Kahf" },
    { id: 72, ayah_ar: "إِنَّهُمْ فِتْيَةٌ آمَنُوا بِرَبِّهِمْ وَزِدْنَاهُمْ ____", missing_word: "هُدًى", options: ["هُدًى", "نُورًا", "إِيمَانًا"], translation: "Indeed, they were youths who believed in their Lord, and We increased them in guidance", surah: "Al-Kahf" },
    { id: 73, ayah_ar: "وَرَبَطْنَا عَلَىٰ ____", missing_word: "قُلُوبِهِمْ", options: ["قُلُوبِهِمْ", "أَيْدِيهِمْ", "صُدُورِهِمْ"], translation: "And We bound their hearts [with patience]", surah: "Al-Kahf" },
    { id: 74, ayah_ar: "إِذْ قَامُوا فَقَالُوا رَبُّنَا رَبُّ السَّمَاوَاتِ ____", missing_word: "وَالْأَرْضِ", options: ["وَالْأَرْضِ", "وَالْعَالَمِينَ", "وَالنَّاسِ"], translation: "When they stood up and said, 'Our Lord is the Lord of the heavens and the earth'", surah: "Al-Kahf" },
    { id: 75, ayah_ar: "لَّن نَّدْعُوَ مِن دُونِهِ ____", missing_word: "إِلَٰهًا", options: ["إِلَٰهًا", "شَرِيكًا", "وَلِيًّا"], translation: "Never will we invoke besides Him any deity", surah: "Al-Kahf" },
  ],
  // Day 16 - Day 20
  16: [
    { id: 76, ayah_ar: "قَالَ رَبِّ اشْرَحْ لِي ____", missing_word: "صَدْرِي", options: ["صَدْرِي", "قَلْبِي", "أَمْرِي"], translation: "[Moses] said, 'My Lord, expand for me my breast [with assurance]'", surah: "Taha" },
    { id: 77, ayah_ar: "وَيَسِّرْ لِي ____", missing_word: "أَمْرِي", options: ["أَمْرِي", "طَرِيقِي", "عَمَلِي"], translation: "And ease for me my task'", surah: "Taha" },
    { id: 78, ayah_ar: "وَاحْلُلْ عُقْدَةً مِّن ____", missing_word: "لِّسَانِي", options: ["لِّسَانِي", "قَلْبِي", "فَمِي"], translation: "And untie the knot from my tongue'", surah: "Taha" },
    { id: 79, ayah_ar: "يَفْقَهُوا ____", missing_word: "قَوْلِي", options: ["قَوْلِي", "كَلَامِي", "دَعْوَتِي"], translation: "That they may understand my speech'", surah: "Taha" },
    { id: 80, ayah_ar: "وَاجْعَل لِّي وَزِيرًا مِّنْ ____", missing_word: "أَهْلِي", options: ["أَهْلِي", "قَوْمِي", "أَصْحَابِي"], translation: "And appoint for me a minister from my family'", surah: "Taha" },
  ],
  17: [
    { id: 81, ayah_ar: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ ____", missing_word: "لَيْلًا", options: ["لَيْلًا", "فَجْرًا", "نَهَارًا"], translation: "Exalted is He who took His Servant by night", surah: "Al-Isra" },
    { id: 82, ayah_ar: "مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ ____", missing_word: "الْأَقْصَى", options: ["الْأَقْصَى", "النَّبَوِيِّ", "الْكَبِيرِ"], translation: "From al-Masjid al-Haram to al-Masjid al-Aqsa", surah: "Al-Isra" },
    { id: 83, ayah_ar: "الَّذِي بَارَكْنَا ____", missing_word: "حَوْلَهُ", options: ["حَوْلَهُ", "فِيهِ", "عَلَيْهِ"], translation: "Whose surroundings We have blessed", surah: "Al-Isra" },
    { id: 84, ayah_ar: "لِنُرِيَهُ مِنْ ____", missing_word: "آيَاتِنَا", options: ["آيَاتِنَا", "قُدْرَتِنَا", "عَظَمَتِنَا"], translation: "To show him of Our signs", surah: "Al-Isra" },
    { id: 85, ayah_ar: "إِنَّهُ هُوَ السَّمِيعُ ____", missing_word: "الْبَصِيرُ", options: ["الْبَصِيرُ", "الْعَلِيمُ", "الْقَدِيرُ"], translation: "Indeed, He is the Hearing, the Seeing", surah: "Al-Isra" },
  ],
  18: [
    { id: 86, ayah_ar: "قُلْ جَاءَ الْحَقُّ وَزَهَقَ ____", missing_word: "الْبَاطِلُ", options: ["الْبَاطِلُ", "الشَّرُّ", "الْكُفْرُ"], translation: "And say, 'Truth has come, and falsehood has departed'", surah: "Al-Isra" },
    { id: 87, ayah_ar: "إِنَّ الْبَاطِلَ كَانَ ____", missing_word: "زَهُوقًا", options: ["زَهُوقًا", "ضَعِيفًا", "زَائِلًا"], translation: "Indeed is falsehood [by nature] ever bound to depart", surah: "Al-Isra" },
    { id: 88, ayah_ar: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ ____", missing_word: "وَرَحْمَةٌ", options: ["وَرَحْمَةٌ", "وَنُورٌ", "وَهُدًى"], translation: "And We send down of the Qur'an that which is healing and mercy", surah: "Al-Isra" },
    { id: 89, ayah_ar: "لِّلْمُؤْمِنِينَ وَلَا يَزِيدُ الظَّالِمِينَ إِلَّا ____", missing_word: "خَسَارًا", options: ["خَسَارًا", "عَذَابًا", "بُعْدًا"], translation: "For the believers, but it does not increase the wrongdoers except in loss", surah: "Al-Isra" },
    { id: 90, ayah_ar: "وَمَا أُوتِيتُم مِّنَ الْعِلْمِ إِلَّا ____", missing_word: "قَلِيلًا", options: ["قَلِيلًا", "يَسِيرًا", "كَثِيرًا"], translation: "And mankind have not been given of knowledge except a little", surah: "Al-Isra" },
  ],
  19: [
    { id: 91, ayah_ar: "وَبِالْحَقِّ أَنزَلْنَاهُ وَبِالْحَقِّ ____", missing_word: "نَزَلَ", options: ["نَزَلَ", "جَاءَ", "ظَهَرَ"], translation: "And with the truth We have sent the Qur'an down, and with the truth it has descended", surah: "Al-Isra" },
    { id: 92, ayah_ar: "قُلِ ادْعُوا اللَّهَ أَوِ ادْعُوا ____", missing_word: "الرَّحْمَٰنَ", options: ["الرَّحْمَٰنَ", "الْعَزِيزَ", "الْكَرِيمَ"], translation: "Say, 'Call upon Allah or call upon the Most Merciful'", surah: "Al-Isra" },
    { id: 93, ayah_ar: "أَيًّا مَّا تَدْعُوا فَلَهُ الْأَسْمَاءُ ____", missing_word: "الْحُسْنَىٰ", options: ["الْحُسْنَىٰ", "الْعُظْمَىٰ", "الْجَمِيلَةُ"], translation: "Whichever [name] you call - to Him belong the best names", surah: "Al-Isra" },
    { id: 94, ayah_ar: "وَلَا تَجْهَرْ بِصَلَاتِكَ وَلَا ____ بِهَا", missing_word: "تُخَافِتْ", options: ["تُخَافِتْ", "تَسْكُتْ", "تُقَصِّرْ"], translation: "And do not recite [too] loudly in your prayer or [too] quietly", surah: "Al-Isra" },
    { id: 95, ayah_ar: "وَابْتَغِ بَيْنَ ذَٰلِكَ ____", missing_word: "سَبِيلًا", options: ["سَبِيلًا", "طَرِيقًا", "وَسَطًا"], translation: "But seek between that an [intermediate] way", surah: "Al-Isra" },
  ],
  20: [
    { id: 96, ayah_ar: "الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ ____", missing_word: "الدُّنْيَا", options: ["الدُّنْيَا", "الْأُولَى", "الْفَانِيَةِ"], translation: "Wealth and children are [but] adornment of the worldly life", surah: "Al-Kahf" },
    { id: 97, ayah_ar: "وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ ____", missing_word: "ثَوَابًا", options: ["ثَوَابًا", "أَجْرًا", "جَزَاءً"], translation: "But the enduring good deeds are better to your Lord for reward", surah: "Al-Kahf" },
    { id: 98, ayah_ar: "وَخَيْرٌ ____", missing_word: "أَمَلًا", options: ["أَمَلًا", "عَمَلًا", "مَقَامًا"], translation: "And better for [one's] hope", surah: "Al-Kahf" },
    { id: 99, ayah_ar: "وَوُضِعَ ____", missing_word: "الْكِتَابُ", options: ["الْكِتَابُ", "الْمِيزَانُ", "الْحِسَابُ"], translation: "And the record [of deeds] will be placed [open]", surah: "Al-Kahf" },
    { id: 100, ayah_ar: "فَتَرَى الْمُجْرِمِينَ مُشْفِقِينَ مِمَّا ____", missing_word: "فِيهِ", options: ["فِيهِ", "فَعَلُوا", "كَسَبُوا"], translation: "And you will see the criminals fearful of that within it", surah: "Al-Kahf" },
  ],
  // Day 21 - Day 25
  21: [
    { id: 101, ayah_ar: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ ____", missing_word: "وَالْأَرْضِ", options: ["وَالْأَرْضِ", "وَالنُّورِ", "وَالْجِبَالِ"], translation: "Indeed, in the creation of the heavens and the earth", surah: "Al-Imran" },
    { id: 102, ayah_ar: "وَاخْتِلَافِ اللَّيْلِ ____", missing_word: "وَالنَّهَارِ", options: ["وَالنَّهَارِ", "وَالشَّمْسِ", "وَالْقَمَرِ"], translation: "And the alternation of the night and the day", surah: "Al-Imran" },
    { id: 103, ayah_ar: "لَآيَاتٍ لِّأُولِي ____", missing_word: "الْأَلْبَابِ", options: ["الْأَلْبَابِ", "الْعِلْمِ", "الْإِيمَانِ"], translation: "Are signs for those of understanding", surah: "Al-Imran" },
    { id: 104, ayah_ar: "الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا ____", missing_word: "وَقُعُودًا", options: ["وَقُعُودًا", "وَنِيَامًا", "وَسُجُودًا"], translation: "Who remember Allah while standing or sitting", surah: "Al-Imran" },
    { id: 105, ayah_ar: "وَعَلَىٰ جُنُوبِهِمْ وَيَتَفَكَّرُونَ فِي خَلْقِ ____", missing_word: "السَّمَاوَاتِ", options: ["السَّمَاوَاتِ", "الْعَالَمِ", "الْكَونِ"], translation: "And on their sides and give thought to the creation of the heavens", surah: "Al-Imran" },
  ],
  22: [
    { id: 106, ayah_ar: "رَبَّنَا مَا خَلَقْتَ هَٰذَا ____", missing_word: "بَاطِلًا", options: ["بَاطِلًا", "عَبَثًا", "سُدًى"], translation: "Our Lord, You did not create this aimlessly", surah: "Al-Imran" },
    { id: 107, ayah_ar: "سُبْحَانَكَ فَقِنَا عَذَابَ ____", missing_word: "النَّارِ", options: ["النَّارِ", "الْجَحِيمِ", "الْقَبْرِ"], translation: "Exalted are You [above such a thing]; then protect us from the punishment of the Fire", surah: "Al-Imran" },
    { id: 108, ayah_ar: "رَبَّنَا إِنَّكَ مَن تُدْخِلِ النَّارَ فَقَدْ ____", missing_word: "أَخْزَيْتَهُ", options: ["أَخْزَيْتَهُ", "أَهْلَكْتَهُ", "ظَلَمْتَهُ"], translation: "Our Lord, indeed whoever You admit to the Fire - You have disgraced him", surah: "Al-Imran" },
    { id: 109, ayah_ar: "وَمَا لِلظَّالِمِينَ مِنْ ____", missing_word: "أَنصَارٍ", options: ["أَنصَارٍ", "أَعْوَانٍ", "شُفَعَاءَ"], translation: "And for the wrongdoers there are no helpers", surah: "Al-Imran" },
    { id: 110, ayah_ar: "رَبَّنَا فَاغْفِرْ لَنَا ____", missing_word: "ذُنُوبَنَا", options: ["ذُنُوبَنَا", "أَعْمَالَنَا", "خَطَايَانَا"], translation: "Our Lord, so forgive us our sins", surah: "Al-Imran" },
  ],
  23: [
    { id: 111, ayah_ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا ____", missing_word: "اصْبِرُوا", options: ["اصْبِرُوا", "آمِنُوا", "اتَّقُوا"], translation: "O you who have believed, persevere", surah: "Al-Imran" },
    { id: 112, ayah_ar: "وَصَابِرُوا ____", missing_word: "وَرَابِطُوا", options: ["وَرَابِطُوا", "وَجَاهِدُوا", "وَتَابِعُوا"], translation: "And endure and remain stationed", surah: "Al-Imran" },
    { id: 113, ayah_ar: "وَاتَّقُوا اللَّهَ لَعَلَّكُمْ ____", missing_word: "تُفْلِحُونَ", options: ["تُفْلِحُونَ", "تَنْجُونَ", "تَفُوزُونَ"], translation: "And fear Allah that you may be successful", surah: "Al-Imran" },
    { id: 114, ayah_ar: "وَلَا تَهِنُوا وَلَا ____", missing_word: "تَحْزَنُوا", options: ["تَحْزَنُوا", "تَخَافُوا", "تَيْأَسُوا"], translation: "So do not weaken and do not grieve", surah: "Al-Imran" },
    { id: 115, ayah_ar: "وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم ____", missing_word: "مُّؤْمِنِينَ", options: ["مُّؤْمِنِينَ", "مُسْلِمِينَ", "صَابِرِينَ"], translation: "And you will be superior if you are [true] believers", surah: "Al-Imran" },
  ],
  24: [
    { id: 116, ayah_ar: "كُلُّ نَفْسٍ ذَائِقَةُ ____", missing_word: "الْمَوْتِ", options: ["الْمَوْتِ", "الْعَذَابِ", "الْحِسَابِ"], translation: "Every soul will taste death", surah: "Al-Imran" },
    { id: 117, ayah_ar: "وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ ____", missing_word: "الْقِيَامَةِ", options: ["الْقِيَامَةِ", "الْحِسَابِ", "الْبَعْثِ"], translation: "And you will only be given your [full] compensation on the Day of Resurrection", surah: "Al-Imran" },
    { id: 118, ayah_ar: "فَمَن زُحْزِحَ عَنِ النَّارِ وَأُدْخِلَ ____", missing_word: "الْجَنَّةَ", options: ["الْجَنَّةَ", "النَّعِيمَ", "الْفِرْدَوْسَ"], translation: "So he who is drawn away from the Fire and admitted to Paradise", surah: "Al-Imran" },
    { id: 119, ayah_ar: "فَقَدْ ____", missing_word: "فَازَ", options: ["فَازَ", "نَجَا", "أَفْلَحَ"], translation: "Has attained [his desire]", surah: "Al-Imran" },
    { id: 120, ayah_ar: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ ____", missing_word: "الْغُرُورِ", options: ["الْغُرُورِ", "اللَّهْوِ", "الزِّينَةِ"], translation: "And what is the life of this world except the enjoyment of delusion", surah: "Al-Imran" },
  ],
  25: [
    { id: 121, ayah_ar: "إِنَّ اللَّهَ مَعَ ____", missing_word: "الصَّابِرِينَ", options: ["الصَّابِرِينَ", "الْمُتَّقِينَ", "الْمُحْسِنِينَ"], translation: "Indeed, Allah is with the patient", surah: "Al-Baqarah" },
    { id: 122, ayah_ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ ____", missing_word: "وَالصَّلَاةِ", options: ["وَالصَّلَاةِ", "وَالدُّعَاءِ", "وَالْعَمَلِ"], translation: "O you who have believed, seek help through patience and prayer", surah: "Al-Baqarah" },
    { id: 123, ayah_ar: "وَلَا تَقُولُوا لِمَن يُقْتَلُ فِي سَبِيلِ اللَّهِ ____", missing_word: "أَمْوَاتٌ", options: ["أَمْوَاتٌ", "هَلْكَىٰ", "مَوْتَىٰ"], translation: "And do not say about those who are killed in the way of Allah, 'They are dead.'", surah: "Al-Baqarah" },
    { id: 124, ayah_ar: "بَلْ أَحْيَاءٌ وَلَٰكِن لَّا ____", missing_word: "تَشْعُرُونَ", options: ["تَشْكُرُونَ", "تَعْلَمُونَ", "تَشْعُرُونَ"], translation: "Rather, they are alive, but you perceive [it] not", surah: "Al-Baqarah" },
    { id: 125, ayah_ar: "وَبَشِّرِ ____", missing_word: "الصَّابِرِينَ", options: ["الصَّابِرِينَ", "الْمُؤْمِنِينَ", "الْمُخْلِصِينَ"], translation: "And give good tidings to the patient", surah: "Al-Baqarah" },
  ],
  // Day 26 - Day 30
  26: [
    { id: 126, ayah_ar: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ ____", missing_word: "الْقُرْآنُ", options: ["الْقُرْآنُ", "النُّورُ", "الْهُدَىٰ"], translation: "The month of Ramadhan [is that] in which was revealed the Qur'an", surah: "Al-Baqarah" },
    { id: 127, ayah_ar: "هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ ____", missing_word: "وَالْفُرْقَانِ", options: ["وَالْفُرْقَانِ", "وَالْمِيزَانِ", "وَالْحَقِّ"], translation: "A guidance for the people and clear proofs of guidance and criterion", surah: "Al-Baqarah" },
    { id: 128, ayah_ar: "فَمَن شَهِدَ مِنكُمُ الشَّهْرَ ____", missing_word: "فَلْيَصُمْهُ", options: ["فَلْيَصُمْهُ", "فَلْيَقُمْهُ", "فَلْيَشْكُرْهُ"], translation: "So whoever sights [the new moon of] the month, let him fast it", surah: "Al-Baqarah" },
    { id: 129, ayah_ar: "يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ ____", missing_word: "الْعُسْرَ", options: ["الْعُسْرَ", "الضَّيِّقَ", "الْخَوْفَ"], translation: "Allah intends for you ease and does not intend for you hardship", surah: "Al-Baqarah" },
    { id: 130, ayah_ar: "وَلِتُكْمِلُوا الْعِدَّةَ وَلِتُكَبِّرُوا اللَّهَ عَلَىٰ مَا ____", missing_word: "هَدَاكُمْ", options: ["هَدَاكُمْ", "آتَاكُمْ", "عَلَّمَكُمْ"], translation: "And [wants] for you to complete the period and to glorify Allah for that [to] which He has guided you", surah: "Al-Baqarah" },
  ],
  27: [
    { id: 131, ayah_ar: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي ____", missing_word: "قَرِيبٌ", options: ["قَرِيبٌ", "عَلِيمٌ", "سَمِيعٌ"], translation: "And when My servants ask you, [O Muhammad], concerning Me - indeed I am near", surah: "Al-Baqarah" },
    { id: 132, ayah_ar: "أُجِيبُ دَعْوَةَ ____ إِذَا دَعَانِ", missing_word: "الدَّاعِ", options: ["الدَّاعِ", "الْمُؤْمِنِ", "الْمُضْطَرِّ"], translation: "I respond to the invocation of the supplicant when he calls upon Me", surah: "Al-Baqarah" },
    { id: 133, ayah_ar: "فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ ____", missing_word: "يَرْشُدُونَ", options: ["يَرْشُدُونَ", "يَهْتَدُونَ", "يَفُوزُونَ"], translation: "So let them respond to Me [by obedience] and believe in Me that they may be [rightly] guided", surah: "Al-Baqarah" },
    { id: 134, ayah_ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ ____", missing_word: "الصِّيَامُ", options: ["الصِّيَامُ", "الصَّلَاةُ", "الْقِتَالُ"], translation: "O you who have believed, decreed upon you is fasting", surah: "Al-Baqarah" },
    { id: 135, ayah_ar: "كَمَا كُتِبَ عَلَى الَّذِينَ مِن ____", missing_word: "قَبْلِكُمْ", options: ["قَبْلِكُمْ", "حَوْلِكُمْ", "بَعْدِكُمْ"], translation: "As it was decreed upon those before you", surah: "Al-Baqarah" },
  ],
  28: [
    { id: 136, ayah_ar: "وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن ____", missing_word: "رَّبِّكُمْ", options: ["رَّبِّكُمْ", "اللَّهِ", "خَالِقِكُمْ"], translation: "And hasten to forgiveness from your Lord", surah: "Al-Imran" },
    { id: 137, ayah_ar: "وَجَنَّةٍ عَرْضُهَا السَّمَاوَاتُ ____", missing_word: "وَالْأَرْضُ", options: ["وَالْأَرْضُ", "وَالْعَالَمُ", "وَالْكَونُ"], translation: "And a garden as wide as the heavens and earth", surah: "Al-Imran" },
    { id: 138, ayah_ar: "أُعِدَّتْ ____", missing_word: "لِّلْمُتَّقِينَ", options: ["لِّلْمُتَّقِينَ", "لِّلصَّالِحِينَ", "لِّلْمُؤْمِنِينَ"], translation: "Prepared for the righteous", surah: "Al-Imran" },
    { id: 139, ayah_ar: "الَّذِينَ يُنفِقُونَ فِي السَّرَّاءِ ____", missing_word: "وَالضَّرَّاءِ", options: ["وَالضَّرَّاءِ", "وَالْخَلَاءِ", "وَالْمَلَإِ"], translation: "Who spend [in the cause of Allah] during ease and hardship", surah: "Al-Imran" },
    { id: 140, ayah_ar: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ ____", missing_word: "النَّاسِ", options: ["النَّاسِ", "الْمُسْلِمِينَ", "الظَّالِمِينَ"], translation: "And who restrain anger and who pardon the people", surah: "Al-Imran" },
  ],
  29: [
    { id: 141, ayah_ar: "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى ____", missing_word: "اللَّهِ", options: ["اللَّهِ", "الرَّحْمَنِ", "رَبِّكَ"], translation: "And when you have decided, then rely upon Allah", surah: "Al-Imran" },
    { id: 142, ayah_ar: "إِنَّ اللَّهَ يُحِبُّ ____", missing_word: "الْمُتَوَكِّلِينَ", options: ["الْمُتَوَكِّلِينَ", "الصَّابِرِينَ", "الْمُتَّقِينَ"], translation: "Indeed, Allah loves those who rely [upon Him]", surah: "Al-Imran" },
    { id: 143, ayah_ar: "إِن يَنصُرْكُمُ اللَّهُ فَلَا ____ لَكُمْ", missing_word: "غَالِبَ", options: ["غَالِبَ", "خَوْفَ", "هَزِيمَةَ"], translation: "If Allah should aid you, no one can overcome you", surah: "Al-Imran" },
    { id: 144, ayah_ar: "وَعَلَى اللَّهِ فَلْيَتَوَكَّلِ ____", missing_word: "الْمُؤْمِنُونَ", options: ["الْمُؤْمِنُونَ", "الْمُسْلِمُونَ", "الْمُخْلِصُونَ"], translation: "And upon Allah let the believers rely", surah: "Al-Imran" },
    { id: 145, ayah_ar: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ ____", missing_word: "جَمِيعًا", options: ["جَمِيعًا", "دَائِمًا", "دَوْمًا"], translation: "And hold firmly to the rope of Allah all together", surah: "Al-Imran" },
  ],
  30: [
    { id: 146, ayah_ar: "لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ ____", missing_word: "حَسَنَةٌ", options: ["حَسَنَةٌ", "طَيِّبَةٌ", "كَرِيمَةٌ"], translation: "There has certainly been for you in the Messenger of Allah an excellent pattern", surah: "Al-Ahzab" },
    { id: 147, ayah_ar: "لِّمَن كَانَ يَرْجُو اللَّهَ ____", missing_word: "وَالْيَوْمَ الْآخِرَ", options: ["وَالْيَوْمَ الْآخِرَ", "وَالنَّصْرَ", "وَالْجَنَّةَ"], translation: "For anyone whose hope is in Allah and the Last Day", surah: "Al-Ahzab" },
    { id: 148, ayah_ar: "وَذَكَرَ اللَّهَ ____", missing_word: "كَثِيرًا", options: ["كَثِيرًا", "دَائِمًا", "قَلِيلًا"], translation: "And remembers Allah often", surah: "Al-Ahzab" },
    { id: 149, ayah_ar: "يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى ____", missing_word: "اللَّهِ", options: ["اللَّهِ", "الرَّحْمَنِ", "خَالِقِكُمْ"], translation: "O mankind, you are those in need of Allah", surah: "Fatir" },
    { id: 150, ayah_ar: "وَاللَّهُ هُوَ الْغَنِيُّ ____", missing_word: "الْحَمِيدُ", options: ["الْحَمِيدُ", "الْمَجِيدُ", "الْعَظِيمُ"], translation: "While Allah is the Free of need, the Praiseworthy", surah: "Fatir" },
  ],
};