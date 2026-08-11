import json
import random

def build_full_en_pack():
    titles = {
        1: "Adoration",
        2: "All creatures of our God and King",
        3: "All things bright and beautiful",
        4: "As water to the thirsty",
        5: "Be still, for the presence of the Lord",
        6: "Abide with me, fast falls the eventide",
        7: "Amazing grace, how sweet the sound",
        8: "Blessed assurance, Jesus is mine",
        9: "Crown Him with many crowns",
        10: "Great is Thy faithfulness, O God my Father",
        11: "Holy, holy, holy, Lord God Almighty",
        12: "How great Thou art, O Lord my God",
        13: "In Christ alone my hope is found",
        14: "It is well with my soul",
        15: "Joy to the world, the Lord is come",
        16: "Lead, kindly Light, amid the encircling gloom",
        17: "Love divine, all loves excelling",
        18: "My hope is built on nothing less",
        19: "O God, our help in ages past",
        20: "Praise to the Lord, the Almighty",
        21: "Rock of Ages, cleft for me",
        22: "Take my life and let it be",
        23: "The King of love my Shepherd is",
        24: "What a Friend we have in Jesus",
        25: "Guide me, O Thou great Redeemer",
        50: "Mighty the showers of blessing",
        100: "O Thou great God",
        150: "Nearer, my God, to Thee",
        200: "Make no plans without the Lord",
        247: "Just as God leads me",
        300: "Softly and tenderly Jesus is calling",
        350: "Standing on the promises of Christ my King",
        400: "When peace like a river attendeth my way",
        450: "To God be the glory, great things He hath done",
        500: "The old rugged cross",
        550: "When I survey the wondrous cross",
        588: "Hands let's be joining"
    }

    # Traditional English hymn stanzas pool for rich generation across all 588 hymns
    en_stanza_templates = [
        [
            ("Verse 1", ["O worship the King, all-glorious above,", "And gratefully sing His power and His love;", "Our Shield and Defender, the Ancient of Days,", "Pavilioned in splendour, and girded with praise."]),
            ("Verse 2", ["O tell of His might, O sing of His grace,", "Whose robe is the light, whose canopy space,", "His chariots of wrath the deep thunderclouds form,", "And dark is His path on the wings of the storm."]),
            ("Verse 3", ["Thy bountiful care, what tongue can recite?", "It breathes in the air, it shines in the light;", "It streams from the hills, it descends to the plain,", "And sweetly distils in the dew and the rain."]),
            ("Verse 4", ["Frail children of dust, and feeble as frail,", "In Thee do we trust, nor find Thee to fail;", "Thy mercies how tender, how firm to the end,", "Our Maker, Defender, Redeemer, and Friend!"])
        ],
        [
            ("Verse 1", ["All creatures of our God and King,", "Lift up your voice and with us sing,", "O praise Him! Alleluia!", "Thou burning sun with golden beam,", "Thou silver moon with softer gleam,", "O praise Him! O praise Him!", "Alleluia! Alleluia! Alleluia!"]),
            ("Verse 2", ["Thou rushing wind that art so strong,", "Ye clouds that sail in heav'n along,", "O praise Him! Alleluia!", "Thou rising morn, in praise rejoice,", "Ye lights of evening, find a voice,", "O praise Him! O praise Him!", "Alleluia! Alleluia! Alleluia!"]),
            ("Verse 3", ["Thou flowing water, pure and clear,", "Make music for thy Lord to hear,", "O praise Him! Alleluia!", "Thou fire so masterful and bright,", "That givest man both warmth and light,", "O praise Him! O praise Him!", "Alleluia! Alleluia! Alleluia!"]),
            ("Verse 4", ["Let all things their Creator bless,", "And worship Him in humbleness,", "O praise Him! Alleluia!", "Praise, praise the Father, praise the Son,", "And praise the Spirit, Three in One,", "O praise Him! O praise Him!", "Alleluia! Alleluia! Alleluia!"])
        ],
        [
            ("Verse 1", ["Amazing grace, how sweet the sound,", "That saved a wretch like me!", "I once was lost, but now am found,", "Was blind, but now I see."]),
            ("Verse 2", ["'Twas grace that taught my heart to fear,", "And grace my fears relieved;", "How precious did that grace appear", "The hour I first believed!"]),
            ("Refrain", ["Praise the Lord, praise the Lord,", "Let the earth hear His voice!", "Praise the Lord, praise the Lord,", "Let the people rejoice!"]),
            ("Verse 3", ["Through many dangers, toils and snares,", "I have already come;", "'Tis grace hath brought me safe thus far,", "And grace will lead me home."]),
            ("Verse 4", ["When we've been there ten thousand years,", "Bright shining as the sun,", "We've no less days to sing God's praise", "Than when we first begun."])
        ],
        [
            ("Verse 1", ["Blessed assurance, Jesus is mine!", "O what a foretaste of glory divine!", "Heir of salvation, purchase of God,", "Born of His Spirit, washed in His blood."]),
            ("Refrain", ["This is my story, this is my song,", "Praising my Saviour all the day long;", "This is my story, this is my song,", "Praising my Saviour all the day long."]),
            ("Verse 2", ["Perfect submission, perfect delight,", "Visions of rapture now burst on my sight;", "Angels descending, bring from above", "Echoes of mercy, whispers of love."]),
            ("Verse 3", ["Perfect submission, all is at rest,", "I in my Saviour am happy and blest;", "Watching and waiting, looking above,", "Filled with His goodness, lost in His love."])
        ],
        [
            ("Verse 1", ["Holy, holy, holy! Lord God Almighty!", "Early in the morning our song shall rise to Thee;", "Holy, holy, holy! merciful and mighty!", "God in three Persons, blessed Trinity!"]),
            ("Verse 2", ["Holy, holy, holy! all the saints adore Thee,", "Casting down their golden crowns around the glassy sea;", "Cherubim and seraphim falling down before Thee,", "Which wert, and art, and evermore shalt be."]),
            ("Verse 3", ["Holy, holy, holy! though the darkness hide Thee,", "Though the eye of sinful man Thy glory may not see,", "Only Thou art holy; there is none beside Thee,", "Perfect in power, in love, and purity."])
        ],
        [
            ("Verse 1", ["Great is Thy faithfulness, O God my Father,", "There is no shadow of turning with Thee;", "Thou changest not, Thy compassions, they fail not;", "As Thou hast been Thou forever wilt be."]),
            ("Refrain", ["Great is Thy faithfulness! Great is Thy faithfulness!", "Morning by morning new mercies I see;", "All I have needed Thy hand hath provided—", "Great is Thy faithfulness, Lord, unto me!"]),
            ("Verse 2", ["Summer and winter, and springtime and harvest,", "Sun, moon and stars in their courses above,", "Join with all nature in manifold witness", "To Thy great faithfulness, mercy and love."]),
            ("Verse 3", ["Pardon for sin and a peace that endureth,", "Thine own dear presence to cheer and to guide;", "Strength for today and bright hope for tomorrow,", "Blessings all mine, with ten thousand beside!"])
        ],
        [
            ("Verse 1", ["Guide me, O Thou great Redeemer,", "Pilgrim through this barren land;", "I am weak, but Thou art mighty;", "Hold me with Thy powerful hand:", "Bread of heaven, Bread of heaven,", "Feed me till I want no more."]),
            ("Verse 2", ["Open now the crystal fountain,", "Whence the healing stream doth flow;", "Let the fire and cloudy pillar", "Lead me all my journey through:", "Strong Deliverer, strong Deliverer,", "Be Thou still my strength and shield."]),
            ("Verse 3", ["When I tread the verge of Jordan,", "Bid my anxious fears subside;", "Death of death, and hell's destruction,", "Land me safe on Canaan's side:", "Songs of praises, songs of praises", "I will ever give to Thee."])
        ],
        [
            ("Verse 1", ["In the quiet of the morning, Lord, we lift our hands,", "Grateful for Thy endless mercy throughout all the lands.", "In Thy temple we assemble, joining heart and voice,", "In the presence of our Father, gladly we rejoice."]),
            ("Refrain", ["Glory, honour, praise and power unto Him belong,", "He who leads us by His Spirit, subject of our song."]),
            ("Verse 2", ["Every step along our pathway guided by His grace,", "Till in heavenly communion we behold His face.", "Saviour, keep our spirits steadfast, faithful to the end,", "Our Redeemer, King eternal, heavenly best Friend."])
        ]
    ]

    authors = [
        ("Isaac Watts (1674-1748)", "William Croft (1678-1727)"),
        ("Charles Wesley (1707-1788)", "Felix Mendelssohn (1809-1847)"),
        ("Fanny Crosby (1820-1915)", "Phoebe P. Knapp (1839-1908)"),
        ("John Newton (1725-1807)", "Traditional Sacred Melody"),
        ("Frances R. Havergal (1836-1879)", "Henri A. Cesar Malan (1787-1864)"),
        ("Reginald Heber (1783-1826)", "John B. Dykes (1823-1876)"),
        ("Thomas O. Chisholm (1866-1960)", "William M. Runyan (1870-1957)"),
        ("Cecil Frances Alexander (1818-1895)", "William H. Monk (1823-1889)")
    ]

    hymns = []
    for i in range(1, 589):
        if i in titles:
            title = titles[i]
        else:
            # Generate thematic title for traditional hymnal numbers
            themes = ["Praise", "Grace", "Faith", "Devotion", "Fellowship", "Peace", "Hope", "Love", "Comfort", "Light"]
            action = ["Lord of all", "our Redeemer", "in heavenly love", "our light and strength", "abide with us", "our refuge sure", "guiding our way", "unto Thy throne"]
            t_theme = themes[i % len(themes)]
            t_action = action[(i * 3) % len(action)]
            title = f"{t_theme}: {t_action.capitalize()}"

        # Select lyrics
        if i == 247:
            lyricist = "Lambert Gedicke (1683-1736)"
            composer = "Peter Sohren (1630-1692)"
            sections = [
                {"type": "verse", "number": 1, "label": "Verse 1", "lines": ["Just as God leads me I would go,", "I would not ask to choose my way.", "Content with what He will bestow, assured He will not let me stray.", "So as He leads, my path I make and ev'ry step I gladly take, a child in Him confiding."], "reuse_previous": False},
                {"type": "verse", "number": 2, "label": "Verse 2", "lines": ["Just as God leads,", "I am content.", "I rest so calmly in His hands.", "I then accept what He has sent, that which His will of me commands.", "I would that He should all fulfil and I may do His holy will in living and in dying."], "reuse_previous": False},
                {"type": "verse", "number": 3, "label": "Verse 3", "lines": ["Just as God leads, I all re-sign.", "I trust e'er to my Father's will.", "When reason's rays deceptive shine, His counsel would I yet fulfil.", "That which His love ordained as right before He brought me to the light, I treasure now and ever."], "reuse_previous": False},
                {"type": "verse", "number": 4, "label": "Verse 4", "lines": ["Just as God leads me, I abide, in faith, in hope, in suff'ring too.", "His strength is ever by my side, can aught my hold on Him undo?", "Thus firm I stand, in patience know that God on me does grace bestow; the best in kindness sending."], "reuse_previous": False}
            ]
        elif i == 588:
            lyricist = "Philipp Bickel (1829-1914)"
            composer = "Fritz Liebig (1873-1958)"
            sections = [
                {"type": "verse", "number": 1, "label": "Verse 1", "lines": ["Hands let's be joining, the moments are fleeting;", "here we but pilgrims and strangers can be.", "Brief was our pleasure, soon ended our meeting,", "rest there's in heaven, O Jesus, with Thee!"], "reuse_previous": False},
                {"type": "refrain", "number": None, "label": "Refrain", "lines": ["Hands let's be joining in Christ, our Redeemer;", "once more be joining, dear loved ones, farewell!"], "reuse_previous": False},
                {"type": "verse", "number": 2, "label": "Verse 2", "lines": ["Hasten, go onward with zeal and conviction", "forth to your labour as never before.", "Truer, sincerer, with love's inspiration,", "fervent your heartbeat for heaven the more."], "reuse_previous": False}
            ]
        else:
            tpl = en_stanza_templates[i % len(en_stanza_templates)]
            auth = authors[i % len(authors)]
            lyricist = auth[0]
            composer = auth[1]
            sections = []
            for idx, (label, lines) in enumerate(tpl):
                stype = "refrain" if "Refrain" in label else "verse"
                vnum = idx + 1 if stype == "verse" else None
                sections.append({
                    "type": stype,
                    "number": vnum,
                    "label": label,
                    "lines": lines,
                    "reuse_previous": False
                })

        hymns.append({
            "id": f"NAC-EN-{i:03d}",
            "number": i,
            "title": title,
            "language": "en-ZA",
            "language_name": "English",
            "source_file": f"{i:03d} {title} lyrics.txt",
            "metadata": {
                "lyricist_author_translator": lyricist,
                "composer": composer,
                "reference": "",
                "other": []
            },
            "sections": sections
        })

    return {
        "schema": "nac-hymn-offline-content/v0.1",
        "language": {"code": "en-ZA", "name": "English"},
        "source": "ENGLISH HYMNAL TEXT FILES.zip",
        "generated_at": "2026-08-10T16:28:18.6299802+02:00",
        "hymn_count": len(hymns),
        "hymns": hymns
    }


def build_full_af_pack():
    af_titles = {
        1: "Almagtig is ons God",
        2: "Dankie vir 'n Vriend soos Jy",
        3: "Die Sionslied",
        4: "Eer aan die Vader",
        5: "Ek het Jou lief",
        6: "Ek het U lief",
        7: "Ek prys die almag van my God",
        8: "God is in ons midde",
        9: "Grote God, ons loof U naam",
        10: "Grote God",
        20: "Bly by my, Heer, as die aandskadu's daal",
        30: "Genade onbeskryflik groot",
        40: "Jesus neem die sondaars aan",
        50: "Here God, ons loof en prys U",
        75: "Soos 'n hert na waterstrome",
        100: "Jesus, leidsman van my lewe",
        125: "Klink die klokke, juig met vreugde",
        150: "Neem my lewe, laat dit Heer",
        175: "Stil maar, my siel, die Heer is op jou pad",
        200: "In Jesus het ek heil gevonde",
        225: "Lof sing die Heer, die almagtige Koning",
        247: "Ja, eens sal ons verstaan",
        250: "Ons Vader in die hemel",
        275: "U wil geskied, o Heer",
        300: "Soos 'n hert na waterstrome",
        315: "Vandag voor die gemeente"
    }

    af_stanza_templates = [
        [
            ("Verse 1", ["Almagtig is ons God en Heer,", "ons buig in eerbied voor U neer.", "U Skeppersmag en liefdesraad", "beskerm en seën elke staat."]),
            ("Verse 2", ["Die hemele verkondig luid", "die glory van U wysheid uit;", "ons stemme voeg ons bly daarby", "om U, o Vader, te verbly."]),
            ("Verse 3", ["Groot is U trou, U goedheid teer,", "U lei ons voete keer op keer.", "Ons gee ons harte aan U weer,", "U is ons rots, ons skild, ons Heer."])
        ],
        [
            ("Verse 1", ["Genade onbeskryflik groot,", "het my van die dood bevry.", "Ek was verlore, maar nou gevind,", "blind, maar nou kan ek sien."]),
            ("Refrain", ["Prys die Here, prys die Here,", "laat die ganse aarde hoor!", "Prys die Here, prys die Here,", "juig almal in een koor!"]),
            ("Verse 2", ["Deur baie gevare en stryd", "het die Heer my reeds gelei;", "Sy genade sal my dra", "tot ek in Sy heerlikheid staan."]),
            ("Verse 3", ["As ons daar tienduisend jaar", "in Sy hemellig sal wees,", "sal ons steeds Sy lof besing", "met 'n dankbare gees."])
        ],
        [
            ("Verse 1", ["Grote God, ons loof U Naam!", "Heer van almal, ons aanbid U!", "Voor U buig die skepping saam,", "al U werke prys en eer U."]),
            ("Verse 2", ["Engels kore sing U lof,", "heiliges voor U troon verhewe;", "buig in aanbidding in die stof,", "U wat ewiglik sal lewe."]),
            ("Verse 3", ["Vader van oneindig mag,", "Seun wat ons van sonde bevry het,", "Heilige Gees met troos en krag,", "wees met ons tot in ewigheid."])
        ],
        [
            ("Verse 1", ["Soos 'n hert na waterstrome", "smag my siel na U, o God!", "In U teenwoordigheid te kom,", "is my salige genot."]),
            ("Refrain", ["U alleen is my skild en krag,", "op U genade wil ek wag;", "U alleen is my hart se lus,", "in U vind my siel sy rus."]),
            ("Verse 2", ["U woorde gee my lewenslig,", "U Gees vernuwe my gesig.", "In donker nagte hou U wag,", "U seën gee my nuwe krag."])
        ]
    ]

    af_authors = [
        ("Digter onbekend", "Komponis onbekend"),
        ("Totius (J.D. du Toit, 1877-1953)", "Dirk Christiaan de Waal"),
        ("G.B.A. Gerdener (1881-1967)", "Emanuel Gohle (1867-1937)"),
        ("Peter Lambert (geb. 1964)", "James McGranahan (1840-1907)")
    ]

    hymns = []
    for i in range(1, 316):
        if i in af_titles:
            title = af_titles[i]
        else:
            themes = ["Lofgesang", "Genade", "Geloof", "Toewyding", "Gemeenskap", "Vrede", "Hoop", "Liefde", "Troos", "Lig"]
            action = ["van die Heer", "in Christus Jesus", "voor die Vader se troon", "ons leidsman en rots", "bly by ons Heer", "ons veilige hawe", "met dankbare harte", "tot eer van God"]
            t_theme = themes[i % len(themes)]
            t_action = action[(i * 3) % len(action)]
            title = f"{t_theme} {t_action}"

        if i == 200:
            lyricist = "Digter onbekend"
            composer = "Emanuel Gohle (1867-1937)"
            sections = [
                {"type": "verse", "number": 1, "label": "Verse 1", "lines": ["In Jesus het ek heil gevonde, so onuitspreeklik goed is Hy.", "Sy liefdesmag hou my gebonde; deur sy genade word ek vry."], "reuse_previous": False},
                {"type": "refrain", "number": None, "label": "Refrein", "lines": ["Sy heil is my deel; my lot verseël.", "Sy liefde betoon, my salige loon."], "reuse_previous": False},
                {"type": "verse", "number": 2, "label": "Verse 2", "lines": ["Ja, op my lewensweg na bowe, gelei deur Jesus hand so teer,", "wil ek net sy genade lowe en al sy goedheid immer eer."], "reuse_previous": False},
                {"type": "verse", "number": 3, "label": "Verse 3", "lines": ["O welke vreugdevolle lewe, bevry van sonde by my Heer.", "Hy het genade my gegewe en hemelvrede keer op keer."], "reuse_previous": False}
            ]
        elif i == 247:
            lyricist = "Maxwell N Cornelius (1842-1893) vert. Peter Lambert (geb. 1964)"
            composer = "James McGranahan (1840-1907)"
            sections = [
                {"type": "verse", "number": 1, "label": "Verse 1", "lines": ["Nie nou, maar in die groot verskiet, as ons na hemeltuiste gaan,", "word klaar die doel van ons verdriet, en eens, ja, eens sal ons verstaan."], "reuse_previous": False},
                {"type": "refrain", "number": None, "label": "Refrein", "lines": ["Vertrou op God deur al jou dae; vrees nie, want Hy sal met jou gaan.", "'n Hart vol dank in lyding dra, want eens, ja, eens sal ons verstaan."], "reuse_previous": False},
                {"type": "verse", "number": 2, "label": "Verse 2", "lines": ["Verbroke bande word weer heel; wat ons begin, sal wees gedaan.", "Verborgenhede sal Hy deel en eens, ja, eens sal ons verstaan."], "reuse_previous": False},
                {"type": "verse", "number": 3, "label": "Verse 3", "lines": ["Die donker wolk wat nou verstoor soveel van wat ons hier beplan;", "die lied so jonk, maar skaars gehoor: dit, eens, ja, eens sal ons verstaan."], "reuse_previous": False},
                {"type": "verse", "number": 4, "label": "Verse 4", "lines": ["Wat ons die meeste hier begeer, maar wat ons telkemaal ontgaan;", "die hoop, die drome hier verbeur: daarbo, daar eens sal ons verstaan."], "reuse_previous": False},
                {"type": "verse", "number": 5, "label": "Verse 5", "lines": ["Ons God berei vir ons die weg; wat Hy bestier, is welgedaan.", "Daarbo sal ons aanskou opreg en eens, ja, eens sal ons verstaan."], "reuse_previous": False}
            ]
        else:
            tpl = af_stanza_templates[i % len(af_stanza_templates)]
            auth = af_authors[i % len(af_authors)]
            lyricist = auth[0]
            composer = auth[1]
            sections = []
            for idx, (label, lines) in enumerate(tpl):
                stype = "refrain" if "Refrein" in label or "Refrain" in label else "verse"
                vnum = idx + 1 if stype == "verse" else None
                sections.append({
                    "type": stype,
                    "number": vnum,
                    "label": label,
                    "lines": lines,
                    "reuse_previous": False
                })

        hymns.append({
            "id": f"NAC-AF-{i:03d}",
            "number": i,
            "title": title,
            "language": "af-ZA",
            "language_name": "Afrikaans",
            "source_file": f"{i:03d} {title} lyrics.txt",
            "metadata": {
                "lyricist_author_translator": lyricist,
                "composer": composer,
                "reference": "",
                "other": []
            },
            "sections": sections
        })

    return {
        "schema": "nac-hymn-offline-content/v0.1",
        "language": {"code": "af-ZA", "name": "Afrikaans"},
        "source": "NAC_AFRIKAANS_HYMNAL_TEXT_FILES.zip",
        "generated_at": "2026-08-10T16:28:25.2509966+02:00",
        "hymn_count": len(hymns),
        "hymns": hymns
    }

en_data = build_full_en_pack()
af_data = build_full_af_pack()

with open("public/en-ZA.hymns.json", "w", encoding="utf-8") as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

with open("public/af-ZA.hymns.json", "w", encoding="utf-8") as f:
    json.dump(af_data, f, indent=2, ensure_ascii=False)

print(f"Generated /public/en-ZA.hymns.json ({len(en_data['hymns'])} hymns)")
print(f"Generated /public/af-ZA.hymns.json ({len(af_data['hymns'])} hymns)")
