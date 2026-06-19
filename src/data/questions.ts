export interface Question {
  id: number;
  questionText: string;
  hint: string;
}

export const speechQuestionsData: Record<string, Record<number, Question[]>> = {
  albania: {
    1: [
      {
        id: 1,
        questionText: "What does the '360-degree security' approach advocated by the Albanian delegation represent?",
        hint: "Think about the connection between the Eastern and Southern flanks, and the Mediterranean security environment."
      },
      {
        id: 2,
        questionText: "How does Albania argue that a small nation can contribute to Alliance security and support Ukraine?",
        hint: "Consider the points made on allied solidarity, moral duties, and their geographic perspective."
      }
    ],
    2: [
      {
        id: 1,
        questionText: "To which cultural heritage does Albania refer when taking responsibility for refugees from Ukraine?",
        hint: "Focus on the Besa tradition and values of hospitality in Albanian culture."
      },
      {
        id: 2,
        questionText: "What collective actions does Albania request from allies regarding humanitarian aid and the refugee crisis?",
        hint: "Look into load sharing, coordination mechanisms, and the safety of humanitarian corridors."
      }
    ],
    3: [
      {
        id: 1,
        questionText: "What joint strategy does Albania propose in response to the trans-boundary nature of cyber attacks?",
        hint: "Address shared defense mechanisms, information sharing, and cyber resilience."
      },
      {
        id: 2,
        questionText: "What are Albania's main challenges and goals while securing its digital infrastructure?",
        hint: "Focus on the protection of critical public services and democratic processes from external interference."
      }
    ],
    4: [
      {
        id: 1,
        questionText: "Which modern technologies does Albania advocate using to improve humanitarian aid distribution and logistics?",
        hint: "Consider the role of blockchain, data analytics, and drones in aid delivery."
      },
      {
        id: 2,
        questionText: "How is the role of technological innovation in protecting civilian lives in conflict zones addressed?",
        hint: "Focus on early warning systems, secure communication networks, and targeted aid."
      }
    ],
    5: [
      {
        id: 1,
        questionText: "How should the balance between border security measures and the protection of basic human rights be established?",
        hint: "Reflect on adherence to the Geneva Convention, non-refoulement, and legal pathways."
      },
      {
        id: 2,
        questionText: "What is the regional role of Albania's border security in preventing irregular migration and human trafficking?",
        hint: "Address cooperation along the Balkan route and Frontex/NATO joint operations."
      }
    ],
    6: [
      {
        id: 1,
        questionText: "What international mechanisms does Albania support to ensure that war crimes committed in Ukraine do not go unpunished?",
        hint: "Think about the International Criminal Court (ICC) and proposed Special Tribunals."
      },
      {
        id: 2,
        questionText: "How does establishing accountability play a role in deterring future aggression?",
        hint: "Mention deterrence, the rule of law, and justice as prerequisites for peace."
      }
    ],
    7: [
      {
        id: 1,
        questionText: "Why is the 'multilateral cooperation' emphasized by Albania crucial for the effectiveness of humanitarian aid?",
        hint: "Consider issues like uncoordinated unilateral aid, resource waste, and NATO-EU partnerships."
      },
      {
        id: 2,
        questionText: "What is the rationale behind Albania's proposal to channel aid directly to local governments and NGOs in Ukraine?",
        hint: "Think about rapid needs assessment, reducing bureaucracy, and direct effectiveness on the ground."
      }
    ],
    8: [
      {
        id: 1,
        questionText: "Why does Albania see protecting Ukraine's airspace as vital for the security of the entire Euro-Atlantic region?",
        hint: "Think about nuclear power plant safety, trans-boundary missile threats, and escalation risks."
      },
      {
        id: 2,
        questionText: "How are the delays in supplying air defense systems by allies described as impacting the battlefield?",
        hint: "Focus on the destruction of civil infrastructure, casualties, and weakened defense lines."
      }
    ],
    9: [
      {
        id: 1,
        questionText: "Beyond military victory, what steps does Albania believe are necessary to establish sustainable peace?",
        hint: "Address building democratic institutions, economic development, and infrastructural reconstruction."
      },
      {
        id: 2,
        questionText: "How should the roles be shared between NATO and other international organizations in Ukraine's reconstruction?",
        hint: "Consider providing security guarantees, Marshall Plan-style funding coordination, and institutional reform support."
      }
    ]
  },
  croatia: {
    1: [
      {
        id: 1,
        questionText: "What parallel does the Croatian delegation draw between the war in Ukraine and Croatia's own history?",
        hint: "Think about Croatia's War of Independence (Homeland War) in the 1990s and the fight for sovereignty."
      },
      {
        id: 2,
        questionText: "Why does Croatia present NATO unity as a vital priority in the face of this crisis?",
        hint: "Focus on collective defense (Article 5) and the need to maintain strong deterrence."
      }
    ],
    2: [
      {
        id: 1,
        questionText: "How does Croatia model refugee reception and integration for other allies?",
        hint: "Think about integration into education and healthcare, work permits, and rapid adaptation."
      },
      {
        id: 2,
        questionText: "How is the importance of NATO-EU coordination emphasized to resolve the humanitarian crisis?",
        hint: "Consider logistical corridors, financial resource management, and shared border policies."
      }
    ],
    3: [
      {
        id: 1,
        questionText: "What 'hybrid warfare' elements is Croatia particularly concerned about regarding cyber security?",
        hint: "Think about disinformation campaigns, cyberattacks on critical infrastructure, and social polarization."
      },
      {
        id: 2,
        questionText: "How is Croatia's relationship with NATO cyber centers addressed in terms of collective cyber defense?",
        hint: "Focus on info-sharing networks, cyber exercises, and collaborative early warning systems."
      }
    ],
    4: [
      {
        id: 1,
        questionText: "Why does Croatia prioritize the use of technology and AI in de-mining processes?",
        hint: "Consider Croatia's own historical experience with de-mining and drone/sensor tech."
      },
      {
        id: 2,
        questionText: "How does technological innovation contribute to increasing the safety of humanitarian aid operations?",
        hint: "Think about smart mapping, real-time tracking, and unmanned logistics."
      }
    ],
    5: [
      {
        id: 1,
        questionText: "How does Croatia argue it will respect human rights while securing Adriatic and Schengen external borders?",
        hint: "Reflect on border control transparency, independent monitoring mechanisms, and asylum rights."
      },
      {
        id: 2,
        questionText: "What is the importance of cooperating with neighboring countries and allied agencies (like Frontex) in protecting external borders?",
        hint: "Think about joint patrols, intelligence sharing, and integrated route management."
      }
    ],
    6: [
      {
        id: 1,
        questionText: "How does Croatia's experience with the International Criminal Tribunal for the former Yugoslavia (ICTY) help in prosecuting crimes in Ukraine?",
        hint: "Consider evidence collection standards, witness protection programs, and judicial impartiality."
      },
      {
        id: 2,
        questionText: "Why does the speech urge the international community to act quickly in documenting war crimes?",
        hint: "Think about preventing the destruction of evidence, maintaining victims' trust in justice, and deterring aggressors."
      }
    ],
    7: [
      {
        id: 1,
        questionText: "How does Croatia offer a regional transit corridor through its ports (especially the Port of Rijeka) for humanitarian logistics?",
        hint: "Consider Adriatic sea lanes and rail/road connections to Central and Eastern Europe."
      },
      {
        id: 2,
        questionText: "How can coordination gaps between NGOs and government agencies in multilateral operations be resolved?",
        hint: "Think about single point of contact systems, shared databases, and regular coordination meetings."
      }
    ],
    8: [
      {
        id: 1,
        questionText: "What warning does Croatia issue regarding the risk of air attacks spilling over into NATO territory (referencing past drone crashes like the one in Zagreb)?",
        hint: "Focus on violations of NATO airspace and the need to strengthen the integrated air defense shield."
      },
      {
        id: 2,
        questionText: "Why is air defense not only a military measure but also a fundamental requirement for civilian protection?",
        hint: "Think about protecting hospitals, power grids, and schools from missile strikes."
      }
    ],
    9: [
      {
        id: 1,
        questionText: "How does Croatia address de-mining and veteran reintegration to ensure long-term social stability after conflict?",
        hint: "Think about social reintegration, physical rehabilitation, and psychosocial support programs."
      },
      {
        id: 2,
        questionText: "What is the rationale behind Croatia's strong support for Ukraine's European and Transatlantic integration (EU and NATO membership)?",
        hint: "Address eliminating security vacuums, democratic stability, and regional deterrence."
      }
    ]
  }
};
