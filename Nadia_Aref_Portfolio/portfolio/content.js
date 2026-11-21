/* =========================================================
   CONTENT.JS  —  the main file you edit.
   Contact details, links and all artifact text live here.
   A field you leave out (or set to "") simply does not show.
   ========================================================= */

const SHOW_TODO_HINTS = false;

const SITE = {
  name: "Nadia Aref",
  email: "nadiaaref110103@gmail.com",
  linkedin: "https://www.linkedin.com/in/nadia-aref-369206201",
  github: "https://github.com/NADIAAREF",
  hastiLab: "https://hastilab.cecs.ucf.edu/",
  cv: "assets/Nadia_Aref_CV.pdf",
  roles: [
    "Ph.D. student in Modeling & Simulation",
    "Graduate Researcher, HASTI Lab",
    "Human-centered simulation researcher",
    "AI & digital-twin enthusiast"
  ]
};

/* ---------------------------------------------------------
   ARTIFACTS (the program requires 4 to 7; 1–4 are required)
     img   main image        more  extra images [{src, caption}]
   --------------------------------------------------------- */
const ARTIFACTS = [
  {
    id: "anylogic-bank",
    number: 1,
    title: "Discrete-Event Simulation Using AnyLogic",
    short: "Bank service processes, resource utilization, queue behavior, and simulation experiments.",
    img: "assets/images/anylogic-bank.png",
    more: [
      { src: "assets/images/anylogic-stairs.png", caption: "Companion exercise: an AnyLogic agent-based pedestrian and staircase model." }
    ],
    status: "Course simulation",
    tools: ["AnyLogic", "Discrete-event", "Simulation-based optimization", "Agent-based"],
    tags: ["Simulation"],
    disciplines: ["Operations research", "Service systems"],
    objective: "Model a bank office to study how service flow, staffing, and routing affect queues and resource use.",
    approach: "Modeled customer arrivals, queues, teller resources and service routing. Then changed routing probabilities, added resources and raised teller capacity. Extended the work with simulation-based optimization experiments over monthly expenditure and switching time, with defined parameter ranges, comparison of feasible solutions across scenarios, and sensitivity analysis. I also ran and examined an agent-based staircase model to study spatial constraints and agent movement rules.",
    contribution: "Changed the routing probabilities, resources and teller capacity, configured the optimization experiments, and interpreted the results to support decisions.",
    findings: "Analyzed the effects of each change on resource utilization, waiting times and bottlenecks."
  },
  {
    id: "bass-diffusion",
    number: 2,
    title: "System Dynamics and Bass Diffusion",
    short: "Continuous simulation, adoption behavior, parameter variation, and comparison with discrete-event approaches.",
    img: "assets/images/bass-diffusion.png",
    status: "Course simulation",
    tools: ["AnyLogic", "System dynamics", "Stocks & flows"],
    tags: ["Simulation"],
    disciplines: ["Marketing science", "Systems thinking"],
    objective: "Study how a product spreads through a population using the Bass diffusion model (advertising and word of mouth).",
    approach: "Simulated technology adoption over time and tested changes to model assumptions, including product-lifetime distributions, while considering parameter units.",
    contribution: "Ran the model, changed the product-lifetime distribution and other settings, and compared continuous simulation with discrete-event modeling to choose the paradigm that fits the problem."
  },
  {
    id: "human-agent",
    number: 3,
    title: "Human-to-Artificial Agent Interaction Model for a Student Cramming for an Exam Using an ITS",
    short: "A conceptual model of a stressed student working with an intelligent tutoring system and its pedagogical agent.",
    img: "assets/images/human-agent.png",
    status: "Conceptual model (UCF course project)",
    tools: ["Conceptual modeling", "Eye tracking", "Think-aloud protocols", "Pedagogical agent"],
    tags: ["Human-Centered"],
    disciplines: ["Learning sciences", "Human factors", "Psychology"],
    objective: "Model how a college student under high stress, preparing for a Calculus II exam, interacts with an artificial tutoring agent in a multimedia intelligent tutoring system.",
    approach: "Collaborative conceptual model (with Dhruvi Shah and Cameron Marano) for the course Understanding Humans for Modeling and Simulation. Integrates cognitive, metacognitive, emotional and motivational processes, with multimodal observation channels (eye tracking and screen recording, think-aloud protocols, facial expressions) and adaptive pedagogical agents that give personalized feedback and multimedia scaffolding.",
    contribution: "Co-developed a conceptual model of how students respond to academic stress while preparing for a Calculus II exam, integrating cognitive, metacognitive, emotional and motivational processes.",
    findings: "Designed as a conceptual model; it has not been implemented or validated."
  },
  {
    id: "fire-detection",
    number: 4,
    title: "Fusion-Based Real-Time Fire Detection System Using Deep Learning and Flicker Analysis",
    short: "A lightweight, explainable pipeline that fuses a CNN, color segmentation and flame-flicker analysis to detect fire in video.",
    img: "assets/images/asemfl-fire-poster.jpg",
    status: "Presented at the Academy of Science, Engineering and Medicine of Florida (ASEMFL), Nov 6–7, 2026",
    tools: ["MobileNetV2", "HSV color segmentation", "Flicker (FFT) analysis", "OpenCV", "Grad-CAM"],
    tags: ["AI & Data"],
    disciplines: ["Computer vision", "Signal processing", "Safety engineering"],
    objective: "Detect fire in video streams in real time with a lightweight and explainable system.",
    approach: "A multi-stage fusion pipeline: a MobileNetV2 CNN classifies fire, HSV color detection finds fire-colored regions, and flicker analysis examines temporal flame dynamics. A rule-based fusion step combines the three signals to raise an alarm, and Grad-CAM shows where the network looks.",
    contribution: "I designed, built, evaluated and presented the system, as first author with co-author Veeraraghava Raju Hasti.",
    findings: "97.0% accuracy and 0.993 ROC-AUC on the D-Fire test set, 94.1% fire recall on unseen BoWFire images, and about 4.1 ms per frame on a GPU. The threshold must be recalibrated for each site, and the flicker gate needs a larger video study."
  },
  {
    id: "lstm-anomaly",
    number: 5,
    title: "LSTM-Based Sequential Modeling and Anomaly Detection",
    short: "An LSTM forecaster and an LSTM-VAE reconstruction model that flag unusual electricity-outage patterns in the Central Florida grid.",
    img: "assets/images/lstm-outage.png",
    status: "Sequential modeling project",
    tools: ["LSTM", "LSTM-VAE", "Time-series modeling", "Anomaly scoring"],
    tags: ["AI & Data"],
    disciplines: ["Time-series analysis", "Energy infrastructure", "Machine learning"],
    objective: "Detect unusual electricity-outage patterns in the Central Florida grid (Orange, Osceola, Lake and Seminole) from 15-minute time-series data.",
    approach: "Cleaned and aligned the data, engineered features (outages, change in outages, wind speed, wind gust, precipitation and time features), normalized with StandardScaler, and built 24-step (6-hour) sequences with a chronological train, validation and test split. Two models score anomalies: a two-layer LSTM (64 units) that forecasts the next 15-minute outage count, and an LSTM variational autoencoder with an 8-dimensional latent space that reconstructs the last six hours. Large prediction or reconstruction errors indicate an anomaly. The threshold is the 99th percentile of validation scores, and models are evaluated with precision, recall, F1-score and AUROC.",
    contribution: "Studied LSTM architecture, memory cells, gating mechanisms, and training and inference for temporal data, and prepared the architecture diagrams and research visualizations showing how sequential observations become predictions."
  },
  {
    id: "image-captioning",
    number: 6,
    title: "Image Captioning with Vision Transformers and GPT",
    short: "A multimodal system that pairs a Vision Transformer with a GPT model to caption images.",
    img: "assets/images/image-captioning.png",
    status: "Team project, UCF Human-Robot Interaction course",
    tools: ["Vision Transformer (ViT)", "GPT", "MS COCO", "PyTorch", "Transformers", "LitServe"],
    tags: ["Human-Centered", "AI & Data"],
    disciplines: ["Computer vision", "Natural language processing", "Human-robot interaction", "Accessibility"],
    objective: "Generate accurate, meaningful captions that make visual content more comprehensible, with uses in accessibility, automated tagging and educational tools.",
    approach: "Combined a Vision Transformer for visual analysis with a GPT model for text generation. Fine-tuned the pre-trained models on the MS COCO dataset, evaluated them with BLEU, METEOR, CIDEr and SPICE, and served them through an API built with PyTorch, Transformers and LitServe."
  }
];

/* Filter buttons shown above the artifact grid */
const ARTIFACT_FILTERS = ["All", "Simulation", "AI & Data", "Human-Centered"];
