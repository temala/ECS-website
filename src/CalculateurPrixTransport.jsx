import React, { useState, useMemo } from "react";

// ============================================================================
// Calculateur de Prix Transport — Composant React unique
// Tailwind CSS uniquement — Interface 100% en français
// ============================================================================

const VEHICULES = [
  {
    id: "break",
    nom: "BREAK",
    charge: "350 kg",
    volume: "2,5 m³",
    palettes: "1 palette",
    dimensions: "120L × 80l × 100H cm",
    attente: 35,
    icone: "🚗",
    priceKey: "break",
  },
  {
    id: "fourgon",
    nom: "FOURGON",
    charge: "1 400 kg",
    volume: "12 m³",
    palettes: "3 palettes",
    dimensions: "320L × 124l × 170H cm",
    attente: 40,
    icone: "🚐",
    priceKey: "fourgon",
  },
  {
    id: "gv",
    nom: "GV (Grand Volume 20m³ Hayon)",
    charge: "750 kg",
    volume: "20 m³",
    palettes: "8 palettes",
    dimensions: "400L × 200l × 200H cm",
    attente: 45,
    icone: "🚛",
    priceKey: "gv",
  },
];

// Données : [zone, ville, break, fourgon, gv]
const DESTINATIONS_RAW = [
  ["01 - AIN", "BELLEGARDE", 587.0, 687.0, 955.0], ["01 - AIN", "BELLEY", 602.0, 704.0, 979.0], ["01 - AIN", "BOURG EN BRESSE", 515.0, 602.0, 837.0], ["01 - AIN", "GEX", 567.0, 663.0, 922.0], ["01 - AIN", "NANTUA", 567.0, 663.0, 922.0], ["01 - AIN", "PONT D'AIN", 532.0, 622.0, 865.0],
  ["02 - AISNE", "CHÂTEAU THIERRY", 150.0, 180.0, 225.0], ["02 - AISNE", "HIRSON", 300.0, 350.0, 485.0], ["02 - AISNE", "LAON", 196.0, 228.0, 314.0], ["02 - AISNE", "SOISSONS", 175.0, 210.0, 260.0], ["02 - AISNE", "ST QUENTIN", 219.0, 255.0, 352.0], ["02 - AISNE", "VERVINS", 277.0, 323.0, 447.0], ["02 - AISNE", "VILLERS COTTERETS", 150.0, 180.0, 225.0],
  ["03 - ALLIERS", "GANNAT", 457.0, 534.0, 742.0], ["03 - ALLIERS", "LA PALISSE", 474.0, 554.0, 770.0], ["03 - ALLIERS", "MONTLUCON", 393.0, 459.0, 637.0], ["03 - ALLIERS", "MOULINS", 410.0, 479.0, 666.0], ["03 - ALLIERS", "ST POURCIN", 445.0, 520.0, 723.0], ["03 - ALLIERS", "VICHY", 480.0, 561.0, 780.0],
  ["04 - ALPES HAUTES PROVENCE", "BARREME", 909.0, 1064.0, 1483.0], ["04 - ALPES HAUTES PROVENCE", "CASTELANNE", 932.0, 1091.0, 1521.0], ["04 - ALPES HAUTES PROVENCE", "DIGNE", 868.0, 1016.0, 1416.0], ["04 - ALPES HAUTES PROVENCE", "MANOSQUE", 944.0, 1105.0, 1540.0], ["04 - ALPES HAUTES PROVENCE", "SISTERON", 822.0, 962.0, 1340.0],
  ["05 - HAUTES ALPES", "ASPRES", 770.0, 901.0, 1255.0], ["05 - HAUTES ALPES", "BRIANCON", 793.0, 928.0, 1293.0], ["05 - HAUTES ALPES", "EMBRUN", 822.0, 962.0, 1340.0], ["05 - HAUTES ALPES", "GAP", 776.0, 908.0, 1264.0], ["05 - HAUTES ALPES", "GUILLESTRE", 834.0, 976.0, 1359.0],
  ["06 - ALPES MARITIMES", "ANTIBES", 1060.0, 1241.0, 1730.0], ["06 - ALPES MARITIMES", "CANNES", 1048.0, 1227.0, 1711.0], ["06 - ALPES MARITIMES", "GRASSE", 1060.0, 1241.0, 1730.0], ["06 - ALPES MARITIMES", "MENTON", 1112.0, 1302.0, 1815.0], ["06 - ALPES MARITIMES", "NICE", 1083.0, 1268.0, 1768.0],
  ["07 - ARDECHE", "ANNONAY", 625.0, 731.0, 1017.0], ["07 - ARDECHE", "AUBENAS", 735.0, 860.0, 1198.0], ["07 - ARDECHE", "LAMASTRE", 677.0, 792.0, 1103.0], ["07 - ARDECHE", "LARGENTIERE", 752.0, 880.0, 1226.0], ["07 - ARDECHE", "PRIVAS", 706.0, 826.0, 1150.0],
  ["08 - ARDENNES", "CHARLEVILLE", 288.0, 336.0, 466.0], ["08 - ARDENNES", "GIVET", 341.0, 398.0, 552.0], ["08 - ARDENNES", "RETHEL", 230.0, 268.0, 371.0], ["08 - ARDENNES", "ROCROI", 294.0, 343.0, 476.0], ["08 - ARDENNES", "SEDAN", 306.0, 357.0, 495.0],
  ["09 - ARIEGE", "AX LES THERMES", 1037.0, 1214.0, 1692.0], ["09 - ARIEGE", "FOIX", 984.0, 1152.0, 1606.0], ["09 - ARIEGE", "LEVALANET", 1013.0, 1186.0, 1654.0], ["09 - ARIEGE", "PAMIERS", 961.0, 1125.0, 1568.0], ["09 - ARIEGE", "SAINT GIRONS", 1074.0, 1258.0, 1753.0],
  ["10 - AUBE", "BAR SUR AUBE", 262.0, 306.0, 423.0], ["10 - AUBE", "NOGENT SUR SEINE", 178.0, 231.0, 283.0], ["10 - AUBE", "TROYES", 215.0, 267.0, 333.0],
  ["11 - AUDE", "CARCASSONNE", 1031.0, 1207.0, 1682.0], ["11 - AUDE", "CASTELNAUDARY", 955.0, 1118.0, 1559.0], ["11 - AUDE", "LEZIGNAN", 961.0, 1125.0, 1568.0], ["11 - AUDE", "LIMOUX", 1060.0, 1241.0, 1730.0], ["11 - AUDE", "NARBONNE", 984.0, 1152.0, 1606.0], ["11 - AUDE", "QUILLAN", 1089.0, 1275.0, 1777.0],
  ["12 - AVEYRON", "DECAZEVILLE", 723.0, 846.0, 1179.0], ["12 - AVEYRON", "ESPALION", 752.0, 880.0, 1226.0], ["12 - AVEYRON", "MILLAU", 747.0, 874.0, 1217.0], ["12 - AVEYRON", "RODEZ", 764.0, 894.0, 1245.0], ["12 - AVEYRON", "VILLEFRANCHE DE ROU", 718.0, 840.0, 1169.0],
  ["13 - BOUCHE DU RHONE", "AIX EN PROVENCE", 880.0, 1030.0, 1435.0], ["13 - BOUCHE DU RHONE", "ARLES", 868.0, 1016.0, 1416.0], ["13 - BOUCHE DU RHONE", "MARSEILLE", 903.0, 1057.0, 1473.0], ["13 - BOUCHE DU RHONE", "MARTIGUES", 909.0, 1064.0, 1483.0], ["13 - BOUCHE DU RHONE", "STE MARIE DE LA MER", 903.0, 1057.0, 1473.0],
  ["14 - CALVADOS", "ARROMANCHES", 352.0, 411.0, 571.0], ["14 - CALVADOS", "BAYEUX", 341.0, 398.0, 552.0], ["14 - CALVADOS", "CABOURG", 288.0, 336.0, 466.0], ["14 - CALVADOS", "CAEN", 306.0, 357.0, 495.0], ["14 - CALVADOS", "DEAUVILLE", 271.0, 316.0, 438.0], ["14 - CALVADOS", "FALAISE", 341.0, 398.0, 552.0], ["14 - CALVADOS", "ISIGNY", 381.0, 445.0, 618.0], ["14 - CALVADOS", "LISIEUX", 271.0, 316.0, 438.0], ["14 - CALVADOS", "VIRE", 393.0, 459.0, 637.0],
  ["15 - CANTAL", "AURILLAC", 668.0, 782.0, 1088.0], ["15 - CANTAL", "MAURIAC", 648.0, 758.0, 1055.0], ["15 - CANTAL", "MURAT", 610.0, 714.0, 993.0], ["15 - CANTAL", "ST FLOUR", 607.0, 710.0, 989.0],
  ["16 - CHARENTE", "ANGOULEME", 532.0, 622.0, 865.0], ["16 - CHARENTE", "BARBEZIEUX", 567.0, 663.0, 922.0], ["16 - CHARENTE", "CHALAIS", 602.0, 704.0, 979.0], ["16 - CHARENTE", "COGNAC", 590.0, 690.0, 960.0], ["16 - CHARENTE", "CONFLENS", 494.0, 578.0, 803.0], ["16 - CHARENTE", "RUFFEC", 480.0, 561.0, 780.0],
  ["17 - CHARENTE MARITIME", "LA ROCHELLE", 555.0, 649.0, 903.0], ["17 - CHARENTE MARITIME", "MARENNES", 602.0, 704.0, 979.0], ["17 - CHARENTE MARITIME", "ROCHEFORT", 596.0, 697.0, 970.0], ["17 - CHARENTE MARITIME", "ROYAN", 590.0, 690.0, 960.0], ["17 - CHARENTE MARITIME", "SAINTE", 555.0, 649.0, 903.0], ["17 - CHARENTE MARITIME", "ST JEAN D'ANGELY", 491.0, 574.0, 799.0],
  ["18 - CHER", "BOURGE", 300.0, 350.0, 485.0], ["18 - CHER", "SAINT AMAND", 341.0, 398.0, 552.0], ["18 - CHER", "VIERZON", 254.0, 296.0, 409.0],
  ["19 - CORREZE", "BRIVE LA GAILLARDE", 576.0, 673.0, 936.0], ["19 - CORREZE", "TULLE", 561.0, 656.0, 913.0], ["19 - CORREZE", "USSEL", 602.0, 704.0, 979.0], ["19 - CORREZE", "UZERCHE", 532.0, 622.0, 865.0],
  ["21 - COTE D'OR", "BEAUNE", 370.0, 432.0, 599.0], ["21 - COTE D'OR", "CHATILLON SUR SEINE", 271.0, 316.0, 438.0], ["21 - COTE D'OR", "DIJON", 370.0, 432.0, 599.0], ["21 - COTE D'OR", "MONBARD", 317.0, 370.0, 514.0], ["21 - COTE D'OR", "SAULIEU", 300.0, 350.0, 485.0], ["21 - COTE D'OR", "SEURRE", 402.0, 469.0, 651.0],
  ["22 - COTES D'ARMOR", "DINAN", 486.0, 568.0, 789.0], ["22 - COTES D'ARMOR", "ERQUY", 544.0, 636.0, 884.0], ["22 - COTES D'ARMOR", "GUINGAMP", 573.0, 670.0, 932.0], ["22 - COTES D'ARMOR", "LAMBALLE", 515.0, 602.0, 837.0], ["22 - COTES D'ARMOR", "LANNION", 613.0, 717.0, 998.0], ["22 - COTES D'ARMOR", "PIMPOL", 590.0, 690.0, 960.0], ["22 - COTES D'ARMOR", "SAINT BRIEUC", 544.0, 636.0, 884.0],
  ["23 - CREUSE", "AUBUSSON", 468.0, 547.0, 761.0], ["23 - CREUSE", "GUERET", 462.0, 540.0, 751.0], ["23 - CREUSE", "LA SOUTERRAINE", 422.0, 493.0, 685.0],
  ["24 - DORDOGNE", "BERGERAC", 642.0, 751.0, 1046.0], ["24 - DORDOGNE", "NONTRON", 555.0, 649.0, 903.0], ["24 - DORDOGNE", "PERIGUEUX", 587.0, 687.0, 955.0], ["24 - DORDOGNE", "SARLAT", 631.0, 738.0, 1027.0],
  ["25 - DOUBS", "BAUMES LES DAMES", 520.0, 608.0, 846.0], ["25 - DOUBS", "BESANCON", 480.0, 561.0, 780.0], ["25 - DOUBS", "MONTBELLIARD", 561.0, 656.0, 913.0], ["25 - DOUBS", "MORTEAU", 561.0, 656.0, 913.0], ["25 - DOUBS", "MONTARLIER", 552.0, 646.0, 898.0],
  ["26 - DROME", "DIE", 741.0, 867.0, 1207.0], ["26 - DROME", "MONTELIMAR", 712.0, 833.0, 1160.0], ["26 - DROME", "PIERRELATTE", 735.0, 860.0, 1198.0], ["26 - DROME", "ROMANS", 660.0, 772.0, 1074.0], ["26 - DROME", "VALENCE", 660.0, 772.0, 1074.0],
  ["27 - EURE", "BERNAY", 230.0, 268.0, 371.0], ["27 - EURE", "EVREUX", 189.0, 215.0, 252.0], ["27 - EURE", "GISORS", 180.0, 205.0, 251.0], ["27 - EURE", "LES ANDELYS", 190.0, 220.0, 280.0], ["27 - EURE", "LOUVIERS", 190.0, 220.0, 280.0], ["27 - EURE", "PONT AUDEMER", 225.0, 262.0, 362.0], ["27 - EURE", "VERNON", 160.0, 185.0, 241.0],
  ["28 - EURE ET LOIR", "CHARTRES", 180.0, 200.0, 240.0], ["28 - EURE ET LOIR", "CHATEAUDUN", 190.0, 220.0, 295.0], ["28 - EURE ET LOIR", "MAINTENON", 175.0, 195.0, 235.0], ["28 - EURE ET LOIR", "NOGENT LE ROTROU", 205.0, 240.0, 320.0],
  ["29 - FINISTERE", "BREST", 706.0, 826.0, 1150.0], ["29 - FINISTERE", "BRIGNOGAN", 706.0, 826.0, 1150.0], ["29 - FINISTERE", "CONCARNEAU", 648.0, 758.0, 1055.0], ["29 - FINISTERE", "DOAURNENEZ", 694.0, 812.0, 1131.0], ["29 - FINISTERE", "MORLAIX", 636.0, 744.0, 1036.0], ["29 - FINISTERE", "QUIMPER", 677.0, 792.0, 1103.0],
  ["30 - GARD", "AIGUES MORTES", 880.0, 1030.0, 1435.0], ["30 - GARD", "ALES", 799.0, 935.0, 1302.0], ["30 - GARD", "LE GRAU DU ROI", 880.0, 1030.0, 1435.0], ["30 - GARD", "NIMES", 822.0, 962.0, 1340.0], ["30 - GARD", "PONT ST ESPRIT", 758.0, 887.0, 1236.0],
  ["31 - HTE GARONNE", "AUTERIVE", 996.0, 1166.0, 1625.0], ["31 - HTE GARONNE", "MURET", 979.0, 1146.0, 1597.0], ["31 - HTE GARONNE", "SAINT GAUDENS", 1057.0, 1237.0, 1725.0], ["31 - HTE GARONNE", "TOULOUSE", 958.0, 1122.0, 1563.0],
  ["32 - GERS", "AUCH", 915.0, 1071.0, 1492.0], ["32 - GERS", "CONDOM", 857.0, 1003.0, 1397.0], ["32 - GERS", "MIRANDE", 944.0, 1105.0, 1540.0],
  ["33 - GIRONDE", "ARCACHON", 764.0, 894.0, 1245.0], ["33 - GIRONDE", "BLAYE", 642.0, 751.0, 1046.0], ["33 - GIRONDE", "BORDEAUX", 683.0, 799.0, 1112.0], ["33 - GIRONDE", "LANGON", 729.0, 853.0, 1188.0], ["33 - GIRONDE", "LIBOURNE", 677.0, 792.0, 1103.0], ["33 - GIRONDE", "SOULAC (+BAC)", 607.0, 710.0, 989.0],
  ["34 - HERAULT", "AGDE", 938.0, 1098.0, 1530.0], ["34 - HERAULT", "BEDARIEUX", 851.0, 996.0, 1388.0], ["34 - HERAULT", "BEZIERS", 961.0, 1125.0, 1568.0], ["34 - HERAULT", "MONTPELLIER", 880.0, 1030.0, 1435.0], ["34 - HERAULT", "SAINT PONS", 950.0, 1112.0, 1549.0], ["34 - HERAULT", "SETE", 921.0, 1078.0, 1502.0],
  ["35 - ILLE ET VILAINE", "FOUGERES", 387.0, 452.0, 628.0], ["35 - ILLE ET VILAINE", "REDON", 532.0, 622.0, 865.0], ["35 - ILLE ET VILAINE", "RENNES", 410.0, 479.0, 666.0], ["35 - ILLE ET VILAINE", "SAINT MALO", 503.0, 588.0, 818.0], ["35 - ILLE ET VILAINE", "VITRE", 375.0, 438.0, 609.0],
  ["36 - INDRE", "ARGENTON SUR CREUSE", 358.0, 418.0, 580.0], ["36 - INDRE", "CHATEAUROUX", 323.0, 377.0, 523.0], ["36 - INDRE", "ISSOUDUN", 294.0, 343.0, 476.0], ["36 - INDRE", "LA CHATRE", 358.0, 418.0, 580.0], ["36 - INDRE", "LE BLANC", 393.0, 459.0, 637.0],
  ["37 - INDRE ET LOIRE", "CHÂTEAU RENAULT", 259.0, 302.0, 419.0], ["37 - INDRE ET LOIRE", "CHINON", 358.0, 418.0, 580.0], ["37 - INDRE ET LOIRE", "LOCHES", 329.0, 384.0, 533.0], ["37 - INDRE ET LOIRE", "TOURS", 283.0, 330.0, 457.0],
  ["38 - ISERE", "GRENOBLE", 671.0, 785.0, 1093.0], ["38 - ISERE", "LES ABRETS", 625.0, 731.0, 1017.0], ["38 - ISERE", "SAINT MARCELIN", 689.0, 806.0, 1122.0], ["38 - ISERE", "VIENNE", 578.0, 676.0, 941.0], ["38 - ISERE", "VOIRON", 648.0, 758.0, 1055.0],
  ["39 - JURA", "CHAMPAGNOLE", 491.0, 574.0, 799.0], ["39 - JURA", "DOLE", 439.0, 513.0, 713.0], ["39 - JURA", "LONS LE SAUNIER", 474.0, 554.0, 770.0], ["39 - JURA", "MOREZ", 532.0, 622.0, 865.0], ["39 - JURA", "POLIGNY", 462.0, 540.0, 751.0], ["39 - JURA", "SAINT CLAUDE", 613.0, 717.0, 998.0], ["39 - JURA", "SALINS", 474.0, 554.0, 770.0],
  ["40 - LANDES", "AIRE SUE L'ADOUR", 880.0, 1030.0, 1435.0], ["40 - LANDES", "CASTET", 834.0, 976.0, 1359.0], ["40 - LANDES", "DAX", 857.0, 1003.0, 1397.0], ["40 - LANDES", "MONT DE MARSAN", 839.0, 982.0, 1369.0], ["40 - LANDES", "ROCQUEFORT", 810.0, 948.0, 1321.0],
  ["41 - LOIR ET CHER", "BLOIS", 262.0, 298.0, 352.0], ["41 - LOIR ET CHER", "LA MOTTE BEUVRON", 241.0, 274.0, 324.0], ["41 - LOIR ET CHER", "ROMORANTIN", 304.0, 346.0, 409.0], ["41 - LOIR ET CHER", "SALBRIS", 269.0, 306.0, 362.0], ["41 - LOIR ET CHER", "VENDOME", 255.0, 290.0, 343.0],
  ["42 - LOIRE", "FEURS", 607.0, 710.0, 989.0], ["42 - LOIRE", "MONTBRISSON", 631.0, 738.0, 1027.0], ["42 - LOIRE", "MONTROND LES BAINS", 619.0, 724.0, 1008.0], ["42 - LOIRE", "ROANNE", 532.0, 622.0, 865.0], ["42 - LOIRE", "SAINT ETIENNE", 480.0, 561.0, 780.0],
  ["43 - HAUTE LOIRE", "BRIOUDE", 567.0, 663.0, 922.0], ["43 - HAUTE LOIRE", "LA CHAISE DIEU", 613.0, 717.0, 998.0], ["43 - HAUTE LOIRE", "LEPUY", 636.0, 744.0, 1036.0], ["43 - HAUTE LOIRE", "YSSINGEAUX", 665.0, 778.0, 1084.0],
  ["44 - LOIRE ATLANTIQUE", "CHATEAUBRIAND", 416.0, 486.0, 675.0], ["44 - LOIRE ATLANTIQUE", "LA BAULE", 532.0, 622.0, 865.0], ["44 - LOIRE ATLANTIQUE", "NANTES", 451.0, 527.0, 732.0], ["44 - LOIRE ATLANTIQUE", "PORNIC", 544.0, 636.0, 884.0], ["44 - LOIRE ATLANTIQUE", "SAINT NAZAIRE", 520.0, 608.0, 846.0],
  ["45 - LOIRET", "ARTHENAY", 157.0, 189.0, 220.0], ["45 - LOIRET", "GIEN", 227.0, 274.0, 320.0], ["45 - LOIRET", "MALESHERBES", 129.0, 155.0, 180.0], ["45 - LOIRET", "MEUNG SUR LOIRE", 213.0, 257.0, 300.0], ["45 - LOIRET", "MONTARGIS", 168.0, 201.0, 235.0], ["45 - LOIRET", "ORLEANS", 192.0, 231.0, 270.0], ["45 - LOIRET", "PITHIVIERS", 150.0, 180.0, 225.0], ["45 - LOIRET", "SULLY SUR LOIRE", 234.0, 282.0, 330.0],
  ["46 - LOT", "CAHORS", 683.0, 799.0, 1112.0], ["46 - LOT", "FIGEAC", 677.0, 792.0, 1103.0], ["46 - LOT", "ROCAMADOUR", 631.0, 738.0, 1027.0], ["46 - LOT", "SOUILLAC", 613.0, 717.0, 998.0],
  ["47 - LOT ET GARONNE", "AGEN", 839.0, 982.0, 1369.0], ["47 - LOT ET GARONNE", "CASTILLONNES", 671.0, 785.0, 1093.0], ["47 - LOT ET GARONNE", "MARMANDE", 787.0, 921.0, 1283.0], ["47 - LOT ET GARONNE", "VILLENEUVE SUR LOT", 880.0, 1030.0, 1435.0],
  ["48 - LOZERE", "FLORAC", 732.0, 857.0, 1193.0], ["48 - LOZERE", "MENDE", 689.0, 806.0, 1122.0], ["48 - LOZERE", "VILLEFORT", 758.0, 887.0, 1236.0],
  ["49 - MAINE ET LOIRE", "ANGERS", 352.0, 411.0, 571.0], ["49 - MAINE ET LOIRE", "CHOLET", 416.0, 486.0, 675.0], ["49 - MAINE ET LOIRE", "SAUMUR", 364.0, 425.0, 590.0], ["49 - MAINE ET LOIRE", "SERGE", 393.0, 459.0, 637.0],
  ["50 - MANCHE", "AVRANCHE", 428.0, 500.0, 694.0], ["50 - MANCHE", "CHERBOURG", 451.0, 527.0, 732.0], ["50 - MANCHE", "COUTANCES", 431.0, 503.0, 699.0], ["50 - MANCHE", "GRANVILLE", 445.0, 520.0, 723.0], ["50 - MANCHE", "SAINT LO", 399.0, 466.0, 647.0],
  ["51 - MARNE", "CHALON SUR MARNE", 219.0, 255.0, 352.0], ["51 - MARNE", "EPERNAY", 184.0, 214.0, 295.0], ["51 - MARNE", "REIMS", 184.0, 214.0, 295.0], ["51 - MARNE", "SEZANNE", 170.0, 200.0, 250.0], ["51 - MARNE", "VITRY LE FRANCOIS", 277.0, 323.0, 447.0],
  ["52 - HAUTE MARNE", "CHAUMONT", 300.0, 350.0, 485.0], ["52 - HAUTE MARNE", "LANGRES", 329.0, 384.0, 533.0], ["52 - HAUTE MARNE", "SAINT DIZIER", 306.0, 357.0, 495.0],
  ["53 - MAYENNE", "CHÂTEAU GONTIER", 367.0, 428.0, 594.0], ["53 - MAYENNE", "LAVAL", 329.0, 384.0, 533.0], ["53 - MAYENNE", "MAYENNE", 358.0, 418.0, 580.0],
  ["54 - MEURTHE ET MOSELLE", "LONGWY", 451.0, 527.0, 732.0], ["54 - MEURTHE ET MOSELLE", "LUNEVILLE", 503.0, 588.0, 818.0], ["54 - MEURTHE ET MOSELLE", "NANCY", 462.0, 540.0, 751.0], ["54 - MEURTHE ET MOSELLE", "PONT A MOUSSON", 439.0, 513.0, 713.0], ["54 - MEURTHE ET MOSELLE", "TOUL", 445.0, 520.0, 723.0],
  ["55 - MEUSE", "BAR LE DUC", 352.0, 411.0, 571.0], ["55 - MEUSE", "COMMERCY", 375.0, 438.0, 609.0], ["55 - MEUSE", "ETAIN", 352.0, 411.0, 571.0], ["55 - MEUSE", "VERDUN", 323.0, 377.0, 523.0],
  ["56 - MORBIHAN", "LORIENT", 590.0, 690.0, 960.0], ["56 - MORBIHAN", "PLOERMEL", 486.0, 568.0, 789.0], ["56 - MORBIHAN", "PONTIVY", 549.0, 642.0, 894.0], ["56 - MORBIHAN", "QUIBERON", 636.0, 744.0, 1036.0], ["56 - MORBIHAN", "VANNES", 578.0, 676.0, 941.0],
  ["57 - MOSELLE", "METZ", 404.0, 472.0, 656.0], ["57 - MOSELLE", "BITCHE", 526.0, 615.0, 856.0], ["57 - MOSELLE", "FORBACH", 462.0, 540.0, 751.0], ["57 - MOSELLE", "SARREBOURG", 544.0, 636.0, 884.0], ["57 - MOSELLE", "SARREGUEMINES", 486.0, 568.0, 789.0], ["57 - MOSELLE", "SAINT AVOLD", 451.0, 527.0, 732.0],
  ["58 - NIEVRE", "CHÂTEAU CHINON", 341.0, 398.0, 552.0], ["58 - NIEVRE", "CLAMECY", 259.0, 302.0, 419.0], ["58 - NIEVRE", "NEVERS", 294.0, 343.0, 476.0],
  ["59 - NORD", "ARMENTIERES", 312.0, 364.0, 504.0], ["59 - NORD", "CAMBRAI", 242.0, 282.0, 390.0], ["59 - NORD", "DOUAI", 259.0, 302.0, 419.0], ["59 - NORD", "DUNKERQUE", 381.0, 445.0, 618.0], ["59 - NORD", "LILLE", 294.0, 343.0, 476.0], ["59 - NORD", "MAUBEUGE", 323.0, 377.0, 523.0], ["59 - NORD", "VALENCIENNES", 271.0, 316.0, 438.0],
  ["60 - OISE", "BEAUVAIS", 185.0, 215.0, 270.0], ["60 - OISE", "CHANTILLY", 150.0, 170.0, 205.0], ["60 - OISE", "CLERMONT", 170.0, 190.0, 240.0], ["60 - OISE", "COMPIEGNE", 180.0, 210.0, 260.0], ["60 - OISE", "CREIL", 155.0, 175.0, 210.0], ["60 - OISE", "CREPY EN VALOIS", 163.0, 175.0, 215.0], ["60 - OISE", "MERU", 160.0, 190.0, 210.0], ["60 - OISE", "SENLIS", 151.0, 175.0, 205.0],
  ["61 - ORNE", "ALENCON", 300.0, 350.0, 485.0], ["61 - ORNE", "ARGENTAN", 251.0, 292.0, 404.0], ["61 - ORNE", "FLERS", 381.0, 445.0, 618.0], ["61 - ORNE", "L'AIGLE", 184.0, 214.0, 295.0],
  ["62 - PAS DE CALAIS", "ARRAS", 242.0, 282.0, 390.0], ["62 - PAS DE CALAIS", "BERCK", 312.0, 364.0, 504.0], ["62 - PAS DE CALAIS", "BETHUNES", 283.0, 330.0, 457.0], ["62 - PAS DE CALAIS", "BOULOGNE SUR MER", 399.0, 466.0, 647.0], ["62 - PAS DE CALAIS", "CALAIS", 370.0, 432.0, 599.0], ["62 - PAS DE CALAIS", "LENS", 262.0, 306.0, 423.0], ["62 - PAS DE CALAIS", "SAINT OMER", 335.0, 391.0, 542.0],
  ["63 - PUY DE DOME", "CLERMONT FERRAND", 497.0, 581.0, 808.0], ["63 - PUY DE DOME", "ISSOIRE", 532.0, 622.0, 865.0], ["63 - PUY DE DOME", "LA BOURBOULE", 573.0, 670.0, 932.0], ["63 - PUY DE DOME", "RIOM", 486.0, 568.0, 789.0],
  ["64 - PYRENNEES ATLANTIQUE", "BAYONNE", 909.0, 1064.0, 1483.0], ["64 - PYRENNEES ATLANTIQUE", "BIARRITZ", 921.0, 1078.0, 1502.0], ["64 - PYRENNEES ATLANTIQUE", "HENDAYE", 944.0, 1105.0, 1540.0], ["64 - PYRENNEES ATLANTIQUE", "PAU", 1031.0, 1207.0, 1682.0],
  ["65 - HAUTES PYRENNEES", "LOURDES", 1077.0, 1261.0, 1758.0], ["65 - HAUTES PYRENNEES", "TARBES", 1066.0, 1248.0, 1739.0],
  ["66 - PYRENNEES ORIENTALES", "CERET", 1054.0, 1234.0, 1720.0], ["66 - PYRENNEES ORIENTALES", "COLLIOURE", 1100.0, 1288.0, 1796.0], ["66 - PYRENNEES ORIENTALES", "PERPIGNAN", 1054.0, 1234.0, 1720.0],
  ["67 - BAS RHIN", "HAGUENEAU", 573.0, 670.0, 932.0], ["67 - BAS RHIN", "SAVERNE", 532.0, 622.0, 865.0], ["67 - BAS RHIN", "STRASBOURG", 584.0, 683.0, 951.0],
  ["68 - HAUT RHIN", "COLMAR", 671.0, 785.0, 1093.0], ["68 - HAUT RHIN", "MULHOUSE", 631.0, 738.0, 1027.0], ["68 - HAUT RHIN", "SELESTAT", 642.0, 751.0, 1046.0],
  ["69 - RHONE", "LYON", 544.0, 636.0, 884.0], ["69 - RHONE", "SAINT PRIEST", 561.0, 656.0, 913.0], ["69 - RHONE", "VILLEFRANCHE SUR SAONE", 515.0, 602.0, 837.0],
  ["70 - HAUTE SAONE", "LURE", 445.0, 520.0, 723.0], ["70 - HAUTE SAONE", "LUXEUIL", 451.0, 527.0, 732.0], ["70 - HAUTE SAONE", "VESOUL", 416.0, 486.0, 675.0],
  ["71 - SAONE ET LOIRE", "AUTUN", 375.0, 438.0, 609.0], ["71 - SAONE ET LOIRE", "CHALON SUR SAONE", 402.0, 469.0, 651.0], ["71 - SAONE ET LOIRE", "MACON", 468.0, 547.0, 761.0],
  ["72 - SARTHE", "LA FERTE BERNARD", 235.0, 298.0, 351.0], ["72 - SARTHE", "LA FLECHE", 312.0, 364.0, 504.0], ["72 - SARTHE", "LE MANS", 242.0, 282.0, 390.0],
  ["73 - SAVOIE", "AIX LES BAINS", 671.0, 785.0, 1093.0], ["73 - SAVOIE", "ALBERVILLE", 718.0, 840.0, 1169.0], ["73 - SAVOIE", "CHAMBERY", 663.0, 775.0, 1079.0], ["73 - SAVOIE", "MOUTIERS", 747.0, 874.0, 1217.0],
  ["74 - HAUTE SAVOIE", "ANNECY", 636.0, 744.0, 1036.0], ["74 - HAUTE SAVOIE", "CHAMONIX", 718.0, 840.0, 1169.0], ["74 - HAUTE SAVOIE", "EVIAN", 683.0, 799.0, 1112.0], ["74 - HAUTE SAVOIE", "MEGEVE", 706.0, 826.0, 1150.0],
  ["76 - SEINE MARITIME", "ROUEN", 215.0, 246.0, 330.0], ["76 - SEINE MARITIME", "DIEPPE", 265.0, 309.0, 428.0], ["76 - SEINE MARITIME", "LE HAVRE", 277.0, 323.0, 447.0], ["76 - SEINE MARITIME", "GOURNAY", 200.0, 235.0, 319.0],
  ["79 - DEUX SEVRES", "BRESSUIRE", 480.0, 561.0, 780.0], ["79 - DEUX SEVRES", "NIORT", 483.0, 564.0, 784.0], ["79 - DEUX SEVRES", "THOUARD", 404.0, 472.0, 656.0],
  ["80 - SOMME", "AMIENS", 241.0, 265.0, 333.0], ["80 - SOMME", "PERRONNE", 228.0, 250.0, 314.0], ["80 - SOMME", "ROYE", 187.0, 205.0, 257.0],
  ["81 - TARN", "ALBI", 863.0, 1010.0, 1407.0], ["81 - TARN", "CASTRES", 915.0, 1071.0, 1492.0],
  ["82 - TARN ET GARONNE", "CASTELSARRASIN", 886.0, 1037.0, 1445.0], ["82 - TARN ET GARONNE", "MOISSAC", 892.0, 1044.0, 1454.0], ["82 - TARN ET GARONNE", "MONTAUBAN", 921.0, 1078.0, 1502.0],
  ["83 - VAR", "DRAGUIGNAN", 1008.0, 1180.0, 1644.0], ["83 - VAR", "FREJUS", 1013.0, 1186.0, 1654.0], ["83 - VAR", "SAINT TROPEZ", 1025.0, 1200.0, 1673.0], ["83 - VAR", "TOULON", 979.0, 1146.0, 1597.0],
  ["84 - VAUCLUSE", "AVIGNON", 805.0, 942.0, 1312.0], ["84 - VAUCLUSE", "CARPENTRAS", 816.0, 955.0, 1331.0], ["84 - VAUCLUSE", "CAVAILLON", 822.0, 962.0, 1340.0], ["84 - VAUCLUSE", "ORANGE", 764.0, 894.0, 1245.0],
  ["85 - VENDEE", "LA ROCHE SUR YON", 538.0, 629.0, 875.0], ["85 - VENDEE", "LES SABLES D'OLONNE", 573.0, 670.0, 932.0], ["85 - VENDEE", "NOIRMOUTIER + PONT", 561.0, 656.0, 913.0],
  ["86 - VIENNE", "CHATELLERAULT", 364.0, 425.0, 590.0], ["86 - VIENNE", "POITIERS", 399.0, 466.0, 647.0],
  ["87 - HAUTE VIENNE", "LIMOGES", 474.0, 554.0, 770.0], ["87 - HAUTE VIENNE", "ROCHECHOUART", 518.0, 605.0, 841.0],
  ["88 - VOSGES", "EPINAL", 451.0, 527.0, 732.0], ["88 - VOSGES", "GERARDMER", 520.0, 608.0, 846.0], ["88 - VOSGES", "REMIRMONT", 503.0, 588.0, 818.0], ["88 - VOSGES", "SAINT DIE", 567.0, 663.0, 922.0], ["88 - VOSGES", "VITTEL", 393.0, 459.0, 637.0],
  ["89 - YONNE", "AUXERRE", 241.0, 265.0, 367.0], ["89 - YONNE", "AVALLON", 316.0, 348.0, 438.0], ["89 - YONNE", "SENS", 153.0, 168.0, 304.0], ["89 - YONNE", "TONNERRE", 282.0, 310.0, 388.0],
  ["90 - TERRITOIRE DE BELFORT", "BELFORT", 584.0, 683.0, 951.0],
  ["2A - 2B - CORSE", "2A AJACCIO + FERRY", 1083.0, 1268.0, 1768.0], ["2A - 2B - CORSE", "BONIFACIO + FERRY", 1228.0, 1438.0, 2005.0], ["2A - 2B - CORSE", "2B BASTIA + FERRY", 1083.0, 1268.0, 1768.0], ["2A - 2B - CORSE", "CALVI + FERRY", 1112.0, 1302.0, 1815.0],
  ["GRANDE BRETAGNE", "BELFAST", 1920.0, 2360.0, 2917.0], ["GRANDE BRETAGNE", "BIRMINGHAM", 964.0, 1183.0, 1462.0], ["GRANDE BRETAGNE", "BLACKPOOL", 1263.0, 1563.0, 1920.0], ["GRANDE BRETAGNE", "BRIGHTON", 607.0, 766.0, 925.0], ["GRANDE BRETAGNE", "CAMBRIDGE", 746.0, 925.0, 1123.0], ["GRANDE BRETAGNE", "CANTERBURY", 506.0, 625.0, 766.0], ["GRANDE BRETAGNE", "CARDIFF", 1044.0, 1284.0, 1563.0], ["GRANDE BRETAGNE", "EDIMBOURG", 1462.0, 1801.0, 2221.0], ["GRANDE BRETAGNE", "GLASGOW", 1563.0, 1920.0, 2359.0], ["GRANDE BRETAGNE", "IPSWICH", 787.0, 964.0, 1183.0], ["GRANDE BRETAGNE", "LEEDS", 1105.0, 1343.0, 1663.0], ["GRANDE BRETAGNE", "LEICESTER", 906.0, 1123.0, 1739.0], ["GRANDE BRETAGNE", "LIVERPOOL", 1144.0, 1423.0, 1742.0], ["GRANDE BRETAGNE", "LONDONDERRY", 2081.0, 2558.0, 3136.0], ["GRANDE BRETAGNE", "MANCHESTER", 1123.0, 1382.0, 1702.0], ["GRANDE BRETAGNE", "NEWCASTLE", 1263.0, 1542.0, 1902.0], ["GRANDE BRETAGNE", "NORTHAMPTON", 766.0, 945.0, 1164.0], ["GRANDE BRETAGNE", "NORWICH", 884.0, 1084.0, 1326.0], ["GRANDE BRETAGNE", "NOTTINGHAM", 986.0, 1212.0, 1502.0], ["GRANDE BRETAGNE", "OXFORD", 766.0, 925.0, 1144.0], ["GRANDE BRETAGNE", "PLYMOUTH", 1223.0, 1484.0, 1824.0], ["GRANDE BRETAGNE", "PORTSMOUTH", 705.0, 866.0, 1064.0], ["GRANDE BRETAGNE", "LONDRES", 625.0, 843.0, 964.0],
  ["IRLANDE", "DUBLIN", 1435.0, 1732.0, 2445.0], ["IRLANDE", "LIMERICK", 1920.0, 2360.0, 2917.0],
  ["DANEMARK", "COPENHAGUE + FERRY", 1462.0, 1801.0, 2221.0], ["DANEMARK", "FREDERIKSHAVN", 1622.0, 1979.0, 2418.0], ["DANEMARK", "ALBORG", 1563.0, 1920.0, 2359.0],
  ["SUEDE", "STOCKHLOM", 2029.0, 2504.0, 3455.0], ["SUEDE", "LOMKOPING", 1851.0, 2302.0, 2980.0],
  ["NORVEGE", "OSLO", 2041.0, 2529.0, 3514.0], ["NORVEGE", "HAUGESUND", 2635.0, 3122.0, 3994.0],
  ["ALLEMAGNE", "BERLIN", 1522.0, 1881.0, 2240.0], ["ALLEMAGNE", "BONN", 586.0, 726.0, 866.0], ["ALLEMAGNE", "BREME", 1044.0, 1302.0, 1542.0], ["ALLEMAGNE", "COLOGNE", 607.0, 746.0, 922.0], ["ALLEMAGNE", "DORTMUNT", 705.0, 866.0, 1044.0], ["ALLEMAGNE", "DRESDEN", 1484.0, 1822.0, 2179.0], ["ALLEMAGNE", "DUSSELDORF", 651.0, 776.0, 964.0], ["ALLEMAGNE", "FRANCFORT", 705.0, 866.0, 1084.0], ["ALLEMAGNE", "FRIBOURG", 647.0, 807.0, 964.0], ["ALLEMAGNE", "HAMBOURG", 1123.0, 1404.0, 1681.0],
  ["ALLEMAGNE (suite)", "HANOVRE", 1004.0, 1285.0, 1523.0], ["ALLEMAGNE (suite)", "MUNICH", 1025.0, 1284.0, 1523.0], ["ALLEMAGNE (suite)", "NUREMBERG", 1004.0, 1223.0, 1462.0], ["ALLEMAGNE (suite)", "ROSTOCK", 1343.0, 1663.0, 1982.0], ["ALLEMAGNE (suite)", "STUTTGART", 766.0, 945.0, 1123.0],
  ["BELGIQUE", "BRUXELLE", 425.0, 497.0, 615.0], ["BELGIQUE", "ANVERS", 485.0, 592.0, 710.0], ["BELGIQUE", "BRUGES", 485.0, 604.0, 722.0], ["BELGIQUE", "CHARLEROI", 378.0, 485.0, 604.0], ["BELGIQUE", "COURTRAI", 425.0, 544.0, 663.0], ["BELGIQUE", "DINANT", 378.0, 485.0, 604.0], ["BELGIQUE", "GAND", 461.0, 580.0, 699.0], ["BELGIQUE", "LIEGE", 497.0, 604.0, 722.0], ["BELGIQUE", "MECHELEN", 461.0, 580.0, 699.0], ["BELGIQUE", "MONS", 378.0, 485.0, 604.0], ["BELGIQUE", "NAMUR", 485.0, 604.0, 722.0], ["BELGIQUE", "OSTENDE", 413.0, 663.0, 782.0], ["BELGIQUE", "TOURNAI", 378.0, 485.0, 604.0],
  ["SUISSE", "LAUSANNE", 706.0, 866.0, 1044.0], ["SUISSE", "BALE", 706.0, 866.0, 1041.0], ["SUISSE", "BERNE", 807.0, 986.0, 1183.0], ["SUISSE", "GENEVE", 666.0, 826.0, 986.0], ["SUISSE", "LUCERNE", 807.0, 1004.0, 1183.0], ["SUISSE", "ZURICH", 906.0, 1105.0, 1324.0],
  ["LUXEMBOURG", "DIEKIRCH", 514.0, 651.0, 782.0],
  ["ESPAGNE", "MADRID", 1563.0, 1920.0, 2280.0], ["ESPAGNE", "ALBACETE", 1941.0, 2379.0, 2837.0], ["ESPAGNE", "ALICANTE", 1982.0, 2438.0, 2897.0], ["ESPAGNE", "BARCELONE", 1343.0, 1664.0, 1982.0], ["ESPAGNE", "BILBAO", 1145.0, 1404.0, 1681.0], ["ESPAGNE", "BURGOS", 1324.0, 1642.0, 1961.0], ["ESPAGNE", "CADIX", 2379.0, 2917.0, 3474.0], ["ESPAGNE", "CARTAGENE", 2339.0, 2878.0, 3415.0], ["ESPAGNE", "CORDOUE", 2100.0, 2579.0, 3077.0], ["ESPAGNE", "GRENADE", 2140.0, 2619.0, 3117.0], ["ESPAGNE", "LA COROGNE", 1920.0, 2359.0, 2797.0], ["ESPAGNE", "MALAGA", 2179.0, 2699.0, 3235.0], ["ESPAGNE", "PAMPELUNE", 1164.0, 1443.0, 1702.0], ["ESPAGNE", "SAINT SEBASTIEN", 1044.0, 1284.0, 1523.0], ["ESPAGNE", "SARAGOSSE", 1263.0, 1649.0, 1861.0], ["ESPAGNE", "SEVILLE", 2179.0, 2677.0, 3197.0], ["ESPAGNE", "TOLEDE", 1642.0, 2020.0, 2400.0], ["ESPAGNE", "VALENCE", 1702.0, 2100.0, 2499.0], ["ESPAGNE", "VALLADOLID", 1563.0, 1902.0, 2280.0],
  ["PAYS BAS", "AMSTERDAM", 646.0, 733.0, 878.0], ["PAYS BAS", "ARNHEM", 566.0, 642.0, 770.0], ["PAYS BAS", "BREDA", 487.0, 553.0, 661.0], ["PAYS BAS", "EINDHOVEN", 506.0, 570.0, 679.0], ["PAYS BAS", "ENSCHEDE", 666.0, 753.0, 897.0], ["PAYS BAS", "GRONINGUEN", 726.0, 805.0, 969.0], ["PAYS BAS", "HAARLEM", 666.0, 753.0, 878.0], ["PAYS BAS", "LA HAYE", 546.0, 625.0, 733.0], ["PAYS BAS", "ROTTERDAM", 546.0, 625.0, 733.0], ["PAYS BAS", "UTRECH", 586.0, 642.0, 770.0], ["PAYS BAS", "ZWOLLE", 687.0, 770.0, 915.0],
  ["AUTRICHE", "VIENNE", 1523.0, 1881.0, 2240.0], ["AUTRICHE", "GRAZ", 1523.0, 1881.0, 2240.0],
  ["ITALIE", "ROME", 1642.0, 2161.0, 2418.0], ["ITALIE", "ANCONE", 1582.0, 1961.0, 2339.0], ["ITALIE", "AOSTE", 884.0, 1084.0, 1302.0], ["ITALIE", "BARI", 2140.0, 2619.0, 3117.0], ["ITALIE", "BERGAME", 1105.0, 1364.0, 1621.0], ["ITALIE", "BOLOGNE", 1344.0, 1642.0, 1961.0], ["ITALIE", "BOLZANO", 1423.0, 1742.0, 2081.0], ["ITALIE", "BRINDISI", 2280.0, 2797.0, 3327.0], ["ITALIE", "FLORENCE", 1423.0, 1742.0, 2081.0], ["ITALIE", "GENES", 1123.0, 1364.0, 1642.0], ["ITALIE", "LIVOURNE", 1364.0, 1681.0, 2000.0], ["ITALIE", "MESSINE (+FERRY)", 2818.0, 3475.0, 4145.0], ["ITALIE", "MILAN", 1044.0, 1284.0, 1523.0], ["ITALIE", "NAPLES", 2000.0, 2460.0, 2915.0], ["ITALIE", "PALERME (+FERRY)", 3056.0, 3773.0, 4492.0], ["ITALIE", "PARME", 1164.0, 1443.0, 1702.0], ["ITALIE", "PEROUSE", 1642.0, 2020.0, 2400.0], ["ITALIE", "PESCARE", 1582.0, 1961.0, 2339.0], ["ITALIE", "SAN REMO", 1183.0, 1443.0, 1722.0], ["ITALIE", "TRIESTE", 1563.0, 1920.0, 2299.0], ["ITALIE", "TURIN", 945.0, 1164.0, 1382.0], ["ITALIE", "VENISE", 1343.0, 1663.0, 1982.0], ["ITALIE", "VERONE", 1245.0, 1523.0, 1801.0],
  ["PORTUGAL", "LISBONNE", 2140.0, 2638.0, 3139.0], ["PORTUGAL", "COIMBRA", 2060.0, 2540.0, 3016.0], ["PORTUGAL", "FARO", 2518.0, 3095.0, 3675.0], ["PORTUGAL", "PORTO", 1920.0, 2359.0, 2818.0],
  ["HONGRIE", "BUDAPEST", 1781.0, 2151.0, 2613.0], ["HONGRIE", "MISKOLE", 1988.0, 2414.0, 2965.0],
  ["SLOVAQUIE", "BRATISLAVA", 1613.0, 1982.0, 2362.0],
];

const PAYS_EUROPE = new Set([
  "GRANDE BRETAGNE", "IRLANDE", "DANEMARK", "SUEDE", "NORVEGE",
  "ALLEMAGNE", "ALLEMAGNE (suite)", "BELGIQUE", "SUISSE", "LUXEMBOURG",
  "ESPAGNE", "PAYS BAS", "AUTRICHE", "ITALIE", "PORTUGAL",
  "HONGRIE", "SLOVAQUIE",
]);

const DESTINATIONS = DESTINATIONS_RAW.map((d, i) => ({
  id: i,
  zone: d[0],
  ville: d[1],
  prixBreak: d[2],
  prixFourgon: d[3],
  prixGv: d[4],
  europe: PAYS_EUROPE.has(d[0]),
  corse: d[0] === "2A - 2B - CORSE",
  ferrySupplement: /\+ FERRY/i.test(d[1]) && d[0] !== "2A - 2B - CORSE",
}));

// Format €
const fmtEuro = (n) =>
  n.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/\u202F/g, " ").replace(/\u00A0/g, " ") + " €";

// Normalisation pour recherche fuzzy : accents, casse, espaces
const normalize = (s) =>
  (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Recherche fuzzy simple : retourne les destinations qui contiennent TOUS les mots
const searchDestinations = (query, list) => {
  const q = normalize(query);
  if (!q) return list.slice(0, 40);
  const mots = q.split(/\s+/).filter(Boolean);
  return list.filter((d) => {
    const hay = normalize(d.ville + " " + d.zone);
    return mots.every((m) => hay.includes(m));
  });
};

export default function CalculateurPrixTransport() {
  const [vehiculeId, setVehiculeId] = useState("fourgon");
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState(null);
  const [heuresAttente, setHeuresAttente] = useState(0);
  const [filtre, setFiltre] = useState("tout"); // tout | france | europe
  const [showSuggestions, setShowSuggestions] = useState(false);

  const vehicule = VEHICULES.find((v) => v.id === vehiculeId);

  const destinationsFiltrees = useMemo(() => {
    let list = DESTINATIONS;
    if (filtre === "france") list = list.filter((d) => !d.europe);
    if (filtre === "europe") list = list.filter((d) => d.europe);
    return list;
  }, [filtre]);

  const suggestions = useMemo(
    () => searchDestinations(query, destinationsFiltrees).slice(0, 20),
    [query, destinationsFiltrees]
  );

  const calcul = useMemo(() => {
    if (!destination || !vehicule) return null;
    const prixMap = {
      break: destination.prixBreak,
      fourgon: destination.prixFourgon,
      gv: destination.prixGv,
    };
    const transport = prixMap[vehicule.priceKey];
    const heures = Math.max(0, Math.min(10, Math.ceil(heuresAttente)));
    const attente = heures * vehicule.attente;
    const totalHT = transport + attente;
    const tva = totalHT * 0.2;
    const totalTTC = totalHT + tva;
    return { transport, attente, heures, totalHT, tva, totalTTC };
  }, [destination, vehicule, heuresAttente]);

  const S = {
    card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 16px rgba(21,42,74,0.08)", border: "1px solid #dce1e8", marginBottom: 24 },
    h2: { fontFamily: "'Montserrat', sans-serif", color: "#152a4a", fontSize: 18, fontWeight: 600, marginBottom: 16 },
    label: { color: "#5a6577", fontSize: 13 },
    value: { color: "#152a4a", fontWeight: 600, fontSize: 13, textAlign: "right" },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    navy: "#152a4a",
    red: "#e51414",
    gray: "#5a6577",
    lightGray: "#8c95a4",
    border: "#dce1e8",
    light: "#f4f6f9",
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", color: "#2d3748" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="ecs-calc-grid">
        <style>{`
          @media (min-width: 1024px) {
            .ecs-calc-grid { grid-template-columns: 2fr 1fr !important; }
          }
          @media (min-width: 768px) {
            .ecs-vehicles-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
          .ecs-calc-grid input[type=number]::-webkit-inner-spin-button,
          .ecs-calc-grid input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
          .ecs-calc-grid input[type=number] { -moz-appearance: textfield; }
          .ecs-suggestion-btn:hover { background: ${S.light} !important; }
          .ecs-stepper-btn:hover { background: ${S.light} !important; }
        `}</style>

        {/* Colonne gauche */}
        <div>
          {/* Véhicules */}
          <div style={S.card}>
            <h2 style={S.h2}>1. Choisissez votre véhicule</h2>
            <div className="ecs-vehicles-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              {VEHICULES.map((v) => {
                const actif = v.id === vehiculeId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehiculeId(v.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 12,
                      padding: 16,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: actif ? `2px solid ${S.red}` : `2px solid ${S.border}`,
                      background: actif ? "rgba(229,20,20,0.04)" : "#fff",
                      boxShadow: actif ? "0 4px 20px rgba(229,20,20,0.12)" : "0 1px 3px rgba(21,42,74,0.06)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 28 }}>{v.icone}</span>
                      {actif && (
                        <span style={{ fontSize: 11, fontWeight: 600, background: S.red, color: "#fff", padding: "3px 10px", borderRadius: 20 }}>
                          Sélectionné
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, color: S.navy, marginBottom: 8 }}>
                      {v.nom}
                    </div>
                    <div style={{ fontSize: 12, color: S.gray, lineHeight: 1.8 }}>
                      <div><span style={{ fontWeight: 500 }}>Charge :</span> {v.charge}</div>
                      <div><span style={{ fontWeight: 500 }}>Volume :</span> {v.volume}</div>
                      <div><span style={{ fontWeight: 500 }}>Palettes :</span> {v.palettes}</div>
                      <div><span style={{ fontWeight: 500 }}>Dimensions :</span> {v.dimensions}</div>
                      <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 4, marginTop: 4 }}>
                        <span style={{ fontWeight: 500 }}>Attente :</span> {v.attente} €HT/h
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Destination */}
          <div style={S.card}>
            <h2 style={S.h2}>2. Choisissez votre destination</h2>

            {/* Filtres */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>
              {[
                { id: "tout", label: "Toutes" },
                { id: "france", label: "France" },
                { id: "europe", label: "Europe" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFiltre(f.id)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: filtre === f.id ? S.navy : S.light,
                    color: filtre === f.id ? "#fff" : S.gray,
                  }}
                >
                  {f.label}
                </button>
              ))}
              <span style={{ marginLeft: "auto", fontSize: 12, color: S.lightGray }}>
                {destinationsFiltrees.length} destination{destinationsFiltrees.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Recherche */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Rechercher une ville, un département ou un pays..."
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 40px",
                  border: `1px solid ${S.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "'Open Sans', sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: S.lightGray }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>

              {showSuggestions && suggestions.length > 0 && (
                <ul style={{ position: "absolute", zIndex: 20, width: "100%", marginTop: 4, maxHeight: 280, overflowY: "auto", background: "#fff", border: `1px solid ${S.border}`, borderRadius: 8, boxShadow: "0 10px 30px rgba(21,42,74,0.12)", listStyle: "none", padding: 0 }}>
                  {suggestions.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        className="ecs-suggestion-btn"
                        onMouseDown={(e) => { e.preventDefault(); setDestination(d); setQuery(d.ville); setShowSuggestions(false); }}
                        style={{ width: "100%", textAlign: "left", padding: "10px 16px", border: "none", borderBottom: `1px solid ${S.light}`, background: "transparent", cursor: "pointer", fontFamily: "'Open Sans', sans-serif" }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 500, color: S.navy }}>
                          {d.ville}
                          {d.corse && <span style={{ marginLeft: 8, fontSize: 11, background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 10 }}>Ferry inclus</span>}
                          {d.ferrySupplement && <span style={{ marginLeft: 8, fontSize: 11, background: "#ffedd5", color: "#9a3412", padding: "2px 8px", borderRadius: 10 }}>Ferry en supplément</span>}
                        </div>
                        <div style={{ fontSize: 12, color: S.lightGray }}>{d.zone}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {showSuggestions && query && suggestions.length === 0 && (
                <div style={{ position: "absolute", zIndex: 20, width: "100%", marginTop: 4, background: "#fff", border: `1px solid ${S.border}`, borderRadius: 8, boxShadow: "0 10px 30px rgba(21,42,74,0.12)", padding: 16, fontSize: 14, color: S.gray }}>
                  Aucune destination trouvée pour « {query} »
                </div>
              )}
            </div>

            {destination && (
              <div style={{ marginTop: 16, padding: 12, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(21,42,74,0.04)", border: "1px solid rgba(21,42,74,0.15)" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: S.red }}>Destination sélectionnée</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: S.navy }}>
                    {destination.ville} <span style={{ fontSize: 12, fontWeight: 400, color: S.gray }}>({destination.zone})</span>
                  </div>
                </div>
                <button type="button" onClick={() => { setDestination(null); setQuery(""); }} style={{ color: S.lightGray, fontSize: 20, border: "none", background: "none", cursor: "pointer", lineHeight: 1 }} aria-label="Supprimer">×</button>
              </div>
            )}
          </div>

          {/* Heures d'attente */}
          <div style={S.card}>
            <h2 style={S.h2}>3. Heures d'attente / manutention</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button type="button" className="ecs-stepper-btn" onClick={() => setHeuresAttente(Math.max(0, heuresAttente - 1))} style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${S.border}`, background: "#fff", color: S.navy, fontWeight: 700, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <input
                type="number" min="0" max="10" value={heuresAttente}
                onChange={(e) => setHeuresAttente(Math.max(0, Math.min(10, Number(e.target.value) || 0)))}
                style={{ width: 64, height: 40, textAlign: "center", borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 18, fontWeight: 600, color: S.navy, outline: "none", fontFamily: "'Open Sans', sans-serif" }}
              />
              <button type="button" className="ecs-stepper-btn" onClick={() => setHeuresAttente(Math.min(10, heuresAttente + 1))} style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${S.border}`, background: "#fff", color: S.navy, fontWeight: 700, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              <span style={{ fontSize: 14, color: S.gray }}>
                heure{heuresAttente > 1 ? "s" : ""} × {vehicule.attente} €HT = <span style={{ fontWeight: 600, color: S.navy }}>{fmtEuro(heuresAttente * vehicule.attente)}</span>
              </span>
            </div>
            <p style={{ fontSize: 12, color: S.lightGray, marginTop: 8 }}>Facturation à l'heure entamée (de 0 à 10 h).</p>
          </div>
        </div>

        {/* Colonne droite : récapitulatif */}
        <div>
          <div style={{ position: "sticky", top: 100, background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 30px rgba(21,42,74,0.1)", border: `1px solid ${S.border}` }}>
            <div style={{ padding: 20, background: "linear-gradient(135deg, #152a4a, #1e3a5f)", color: "#fff" }}>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Récapitulatif</h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Détail de votre estimation</p>
            </div>

            <div style={{ padding: 20 }}>
              <div style={S.row}><span style={S.label}>Véhicule</span><span style={S.value}>{vehicule.nom}</span></div>
              <div style={S.row}><span style={S.label}>Destination</span><span style={S.value}>{destination ? destination.ville : "—"}</span></div>
              <div style={S.row}><span style={S.label}>Heures d'attente</span><span style={S.value}>{heuresAttente} h</span></div>

              {destination && destination.corse && (
                <div style={{ background: "#fef3c7", border: "1px solid #fde68a", color: "#92400e", fontSize: 12, borderRadius: 8, padding: 12, marginBottom: 8 }}>🛳️ Prix du ferry inclus (Corse)</div>
              )}
              {destination && destination.ferrySupplement && (
                <div style={{ background: "#ffedd5", border: "1px solid #fed7aa", color: "#9a3412", fontSize: 12, borderRadius: 8, padding: 12, marginBottom: 8 }}>⚠️ Ferry en supplément (non inclus)</div>
              )}

              {calcul ? (
                <>
                  <hr style={{ border: "none", borderTop: `1px solid ${S.border}`, margin: "16px 0" }} />
                  <div style={S.row}><span style={S.label}>Transport HT</span><span style={{ ...S.value, fontWeight: 500 }}>{fmtEuro(calcul.transport)}</span></div>
                  <div style={S.row}><span style={S.label}>Attente ({calcul.heures} × {vehicule.attente} €)</span><span style={{ ...S.value, fontWeight: 500 }}>{fmtEuro(calcul.attente)}</span></div>
                  <div style={{ ...S.row, paddingTop: 12, borderTop: `1px solid ${S.border}`, marginTop: 8 }}>
                    <span style={{ color: S.navy, fontWeight: 600, fontSize: 14 }}>Total HT</span>
                    <span style={{ color: S.navy, fontWeight: 700, fontSize: 14 }}>{fmtEuro(calcul.totalHT)}</span>
                  </div>
                  <div style={S.row}><span style={S.label}>TVA 20 %</span><span style={{ ...S.value, fontWeight: 500 }}>{fmtEuro(calcul.tva)}</span></div>

                  <div style={{ background: S.red, color: "#fff", borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Total TTC</span>
                    <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Montserrat', sans-serif" }}>{fmtEuro(calcul.totalTTC)}</span>
                  </div>
                  <p style={{ fontSize: 12, color: S.lightGray, fontStyle: "italic", textAlign: "center", marginTop: 12 }}>Prestations Porteur / SEMI : sur devis uniquement.</p>
                </>
              ) : (
                <div style={{ background: S.light, border: `1px solid ${S.border}`, borderRadius: 8, padding: 16, textAlign: "center", fontSize: 14, color: S.gray, marginTop: 16 }}>
                  Sélectionnez une destination pour afficher le calcul.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: S.lightGray, textAlign: "center", marginTop: 24 }}>
        Tarifs indicatifs HT — TVA 20 % — {DESTINATIONS.length} destinations disponibles.
      </p>
    </div>
  );
}
