import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

import {
  SiGo,
  SiPython,
  SiCplusplus,
  SiTypescript,
  SiKotlin,
  SiLangchain,
  SiTerraform,
  SiDocker,
  SiJenkins,
  SiApachekafka,
  SiGit,
  SiKubernetes,
  SiGithubactions,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiPrometheus,
  SiGrafana,
  SiOpentelemetry,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiSpringboot,
  SiFlask,
  SiJavascript,
} from "react-icons/si";

import { FaJava, FaBrain, FaRobot, FaAws } from "react-icons/fa";
import { TbDatabaseSearch, TbLogs } from "react-icons/tb";

import "./styles/TechStack.css";

// Skills configuration for 3D physics balls (Hybrid: local image vs dynamic colored canvas)
const ALL_PHYSICS_SKILLS = [
  { name: "React.js", image: "/images/react2.webp" },
  { name: "Next.js", image: "/images/next2.webp" },
  { name: "Node.js", image: "/images/node2.webp" },
  { name: "Express", image: "/images/express.webp" },
  { name: "MongoDB", image: "/images/mongo.webp" },
  { name: "MySQL", image: "/images/mysql.webp" },
  { name: "TypeScript", image: "/images/typescript.webp" },
  { name: "JavaScript", image: "/images/javascript.webp" },
  { name: "Go", image: "/images/go.png" },
  { name: "Python", image: "/images/python.png" },
  { name: "AWS", image: "/images/aws.png" },
  { name: "Terraform", image: "/images/terraform.png" },
  { name: "Docker", image: "/images/docker.png" },
  { name: "Kubernetes", image: "/images/kubernetes.png" },
  // Dynamic Canvas Skills
  { name: "Kotlin", color: "#7F52FF" },
  { name: "Java", color: "#007396" },
  { name: "C/C++", color: "#00599C" },
  { name: "LangChain", color: "#1C3C3C" },
  { name: "RAG", color: "#FF6B6B" },
  { name: "Vector DB", color: "#00a2ff" },
  { name: "AI Agents", color: "#8A2BE2" },
  { name: "Lambda", color: "#FF9900" },
  { name: "DynamoDB", color: "#4053D6" },
  { name: "S3", color: "#569A31" },
  { name: "ECS", color: "#FF9900" },
  { name: "RDS", color: "#527FFF" },
  { name: "SQS", color: "#FF4F8B" },
  { name: "SNS", color: "#FF4F8B" },
  { name: "EventBridge", color: "#FF9900" },
  { name: "CloudWatch", color: "#00A2FF" },
  { name: "API Gateway", color: "#A166FF" },
  { name: "Jenkins", color: "#D24939" },
  { name: "Kafka", color: "#231F20" },
  { name: "Git", color: "#F05032" },
  { name: "GH Actions", color: "#2088FF" },
  { name: "CodePipeline", color: "#FF9900" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "DocumentDB", color: "#47A248" },
  { name: "Redis", color: "#DC382D" },
  { name: "Prometheus", color: "#E6522C" },
  { name: "Grafana", color: "#F46800" },
  { name: "OpenTelemetry", color: "#00A2FF" },
  { name: "Zap Logging", color: "#00a2ff" },
  { name: "Gin", color: "#00ADD8" },
  { name: "Spring Boot", color: "#6DB33F" },
  { name: "Flask", color: "#4B4B4B" },
];

const skillColors: Record<string, string> = {
  // Languages
  "Go": "#00ADD8",
  "Python": "#3776AB",
  "Java": "#007396",
  "C/C++": "#00599C",
  "TypeScript": "#3178C6",
  "Kotlin": "#7F52FF",
  "JavaScript": "#F7DF1E",

  // AI/LLM
  "LangChain": "#1C3C3C",
  "RAG": "#FF6B6B",
  "Vector Databases": "#00a2ff",
  "AI Agents": "#8A2BE2",

  // AWS
  "AWS": "#FF9900",
  "Lambda": "#FF9900",
  "DynamoDB": "#4053D6",
  "S3": "#569A31",
  "ECS": "#FF9900",
  "RDS": "#527FFF",
  "SQS": "#FF4F8B",
  "SNS": "#FF4F8B",
  "EventBridge": "#FF9900",
  "CloudWatch": "#00A2FF",
  "API Gateway": "#A166FF",
  "AWS CodePipeline": "#FF9900",

  // Infra & CI/CD
  "Terraform": "#7B42BC",
  "Docker": "#2496ED",
  "Kubernetes": "#326CE5",
  "Jenkins": "#D24939",
  "Kafka": "#231F20",
  "Git": "#F05032",
  "GitHub Actions": "#2088FF",

  // Databases
  "PostgreSQL": "#4169E1",
  "MySQL": "#4479A1",
  "MongoDB": "#47A248",
  "DocumentDB": "#47A248",
  "Redis": "#DC382D",

  // Observability
  "Prometheus": "#E6522C",
  "Grafana": "#F46800",
  "OpenTelemetry": "#00A2FF",
  "Zap Structured Logging": "#00a2ff",

  // Frameworks
  "React.js": "#61DAFB",
  "Next.js": "#555555",
  "Node.js": "#339933",
  "Express": "#333333",
  "Gin": "#00ADD8",
  "Spring Boot": "#6DB33F",
  "Flask": "#4B4B4B",
};

// Skill Grid Categories
const categories = [
  {
    title: "Languages",
    skills: [
      { name: "Go", icon: SiGo },
      { name: "Python", icon: SiPython },
      { name: "Java", icon: FaJava },
      { name: "C/C++", icon: SiCplusplus },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Kotlin", icon: SiKotlin },
      { name: "JavaScript", icon: SiJavascript },
    ],
  },
  {
    title: "AI/LLM",
    skills: [
      { name: "LangChain", icon: SiLangchain },
      { name: "RAG", icon: FaBrain },
      { name: "Vector Databases", icon: TbDatabaseSearch },
      { name: "AI Agents", icon: FaRobot },
    ],
  },
  {
    title: "AWS Services",
    skills: [
      { name: "AWS", icon: FaAws },
      { name: "Lambda", icon: FaAws },
      { name: "DynamoDB", icon: FaAws },
      { name: "S3", icon: FaAws },
      { name: "ECS", icon: FaAws },
      { name: "RDS", icon: FaAws },
      { name: "SQS", icon: FaAws },
      { name: "SNS", icon: FaAws },
      { name: "EventBridge", icon: FaAws },
      { name: "CloudWatch", icon: FaAws },
      { name: "API Gateway", icon: FaAws },
    ],
  },
  {
    title: "Infra & CI/CD",
    skills: [
      { name: "Terraform", icon: SiTerraform },
      { name: "Docker", icon: SiDocker },
      { name: "Kubernetes", icon: SiKubernetes },
      { name: "Jenkins", icon: SiJenkins },
      { name: "Kafka", icon: SiApachekafka },
      { name: "Git", icon: SiGit },
      { name: "GitHub Actions", icon: SiGithubactions },
      { name: "AWS CodePipeline", icon: FaAws },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MySQL", icon: SiMysql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "DocumentDB", icon: SiMongodb },
      { name: "Redis", icon: SiRedis },
    ],
  },
  {
    title: "Observability & Testing",
    skills: [
      { name: "Prometheus", icon: SiPrometheus },
      { name: "Grafana", icon: SiGrafana },
      { name: "OpenTelemetry", icon: SiOpentelemetry },
      { name: "Zap Structured Logging", icon: TbLogs },
    ],
  },
  {
    title: "Frameworks & Libraries",
    skills: [
      { name: "React.js", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express", icon: SiExpress },
      { name: "Gin", icon: SiGo },
      { name: "Spring Boot", icon: SiSpringboot },
      { name: "Flask", icon: SiFlask },
    ],
  },
];

const textureLoader = new THREE.TextureLoader();
const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(ALL_PHYSICS_SKILLS.length)].map(() => ({
  scale: [0.75, 0.9, 0.8, 0.95, 0.85][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

// Generates canvas texture dynamically with side-by-side text so it wraps around sphere correctly
const createDynamicTexture = (name: string, color: string) => {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background linear gradient matching brand colors
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, "#08060a");
  grad.addColorStop(0.35, color);
  grad.addColorStop(0.65, color);
  grad.addColorStop(1, "#08060a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft glowing orb indicators in background
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(128, 128, 70, 0, Math.PI * 2);
  ctx.arc(384, 128, 70, 0, Math.PI * 2);
  ctx.fill();

  // Glass-like shine gradient overlay
  const shine = ctx.createLinearGradient(0, 0, 0, canvas.height);
  shine.addColorStop(0, "rgba(255, 255, 255, 0.15)");
  shine.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  shine.addColorStop(1, "rgba(0, 0, 0, 0.2)");
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Skill text styling
  ctx.font = "bold 38px 'Geist', 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Double render at U=0.25 (128px) and U=0.75 (384px) to cover both front & back sides of sphere
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(name, 128, 128);
  ctx.fillText(name, 384, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const target = document.getElementById("work");
      if (!target) return;
      const threshold = target.getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };

    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const materials = useMemo(() => {
    const loadedTextures: Record<string, THREE.Texture> = {};
    const generatedTextures: Record<string, THREE.Texture> = {};

    ALL_PHYSICS_SKILLS.forEach((skill) => {
      if (skill.image) {
        loadedTextures[skill.name] = textureLoader.load(skill.image);
      } else {
        const texture = createDynamicTexture(skill.name, skill.color || "#00f3ff");
        if (texture) {
          generatedTextures[skill.name] = texture;
        }
      }
    });

    return ALL_PHYSICS_SKILLS.map((skill) => {
      const texture = skill.image ? loadedTextures[skill.name] : generatedTextures[skill.name];
      return new THREE.MeshPhysicalMaterial({
        map: texture || undefined,
        emissive: skill.image ? "#ffffff" : (skill.color || "#00f3ff"),
        emissiveMap: skill.image ? texture : undefined,
        emissiveIntensity: skill.image ? 0.25 : 0.4,
        metalness: 0.4,
        roughness: 0.8,
        clearcoat: 0.15,
        clearcoatRoughness: 0.1,
      });
    });
  }, []);

  return (
    <div className="techstack">
      <h2>My Techstack</h2>

      {isDesktop && (
        <div className="tech-canvas-container">
          <Canvas
            shadows
            gl={{ alpha: true, antialias: false }} // Depth & stencil default to true now to resolve N8AO blit warnings
            camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
            onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
            className="tech-canvas"
          >
            <ambientLight intensity={1} />
            <spotLight
              position={[20, 20, 25]}
              penumbra={1}
              angle={0.2}
              color="white"
              castShadow
              shadow-mapSize={[512, 512]}
            />
            <directionalLight position={[0, 5, -4]} intensity={2} />
            <Physics gravity={[0, 0, 0]}>
              <Pointer isActive={isActive} />
              {spheres.map((props, i) => (
                <SphereGeo
                  key={i}
                  {...props}
                  material={materials[i % materials.length]}
                  isActive={isActive}
                />
              ))}
            </Physics>
            <Environment
              files="/models/char_enviorment.hdr"
              environmentIntensity={0.5}
              environmentRotation={[0, 4, 2]}
            />
            <EffectComposer enableNormalPass={false}>
              <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
            </EffectComposer>
          </Canvas>
        </div>
      )}

      {/* Categorized Interactive Skills Grid */}
      <div className="skill-grid-section">
        <h3>All Skills & Technologies</h3>
        {categories.map((category, idx) => (
          <div className="skill-category" key={idx}>
            <div className="skill-category-header">
              <div className="skill-category-dot" />
              <h4>{category.title}</h4>
            </div>
            <div className="skill-pills">
              {category.skills.map((skill, sIdx) => {
                const Icon = skill.icon;
                return (
                  <div
                    className="skill-pill"
                    key={sIdx}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty("--pill-x", `${x}px`);
                      e.currentTarget.style.setProperty("--pill-y", `${y}px`);
                    }}
                  >
                    <div
                      className="skill-pill-icon"
                      style={{
                        background: skillColors[skill.name] || "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Icon size={12} />
                    </div>
                    <span className="skill-pill-name">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
