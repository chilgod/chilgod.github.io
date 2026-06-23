import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue
} from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Github, Mail, Menu } from 'lucide-react';

const PERSONAL_BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85';
const PERSONAL_BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85';

const PRISMA_HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';
const FEATURE_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';
const STORYBOARD_ICON =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85';
const CRITIQUES_ICON =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85';
const IMMERSION_ICON =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85';

const PERSONAL_SPOTLIGHT_R = 260;
const PRIMARY_TEXT = '#E1E0CC';
const MOTION_EASE = [0.16, 1, 0.3, 1] as const;

type Point = {
  x: number;
  y: number;
};

type RevealLayerProps = {
  image: string;
  cursorX: number;
  cursorY: number;
};

type WordsPullUpProps = {
  text: string;
  className?: string;
  delay?: number;
  showAsterisk?: boolean;
};

type MultiStyleSegment = {
  text: string;
  className?: string;
};

type WordsPullUpMultiStyleProps = {
  segments: MultiStyleSegment[];
  className?: string;
  delay?: number;
};

type FeatureSpec = {
  index: string;
  title: string;
  icon: string;
  items: string[];
};

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskImage, setMaskImage] = useState('linear-gradient(transparent, transparent)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = context.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      PERSONAL_SPOTLIGHT_R
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(cursorX, cursorY, PERSONAL_SPOTLIGHT_R, 0, Math.PI * 2);
    context.fill();

    setMaskImage(`url(${canvas.toDataURL()})`);
  }, [cursorX, cursorY]);

  const revealStyle: CSSProperties = {
    backgroundImage: `url(${image})`,
    maskImage,
    WebkitMaskImage: maskImage,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%'
  };

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none" style={revealStyle} />
    </>
  );
}

function PersonalLogoMark() {
  return (
    <span
      className="grid size-9 place-items-center rounded-full border border-white/30 bg-white/20 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-md"
      aria-hidden="true"
    >
      LQ
    </span>
  );
}

function WordsPullUp({ text, className = '', delay = 0, showAsterisk = false }: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} aria-label={text}>
      {words.map((word, index) => {
        const isLastWord = index === words.length - 1;
        const wordDelay = shouldReduceMotion ? 0 : delay + index * 0.08;
        const finalLetter = word.slice(-1);
        const prefix = word.slice(0, -1);

        return (
          <motion.span
            key={`${word}-${index}`}
            className="inline-block overflow-visible"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.85, delay: wordDelay, ease: MOTION_EASE }}
          >
            {showAsterisk && isLastWord ? (
              <>
                {prefix}
                <span className="relative inline-block">
                  {finalLetter}
                  <span className="absolute -right-[0.3em] top-[0.65em] text-[0.31em] leading-none">*</span>
                </span>
              </>
            ) : (
              word
            )}
            {index < words.length - 1 ? ' ' : null}
          </motion.span>
        );
      })}
    </div>
  );
}

function WordsPullUpMultiStyle({ segments, className = '', delay = 0 }: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();
  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word) => ({
      word,
      className: segment.className ?? ''
    }))
  );

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {words.map((item, index) => (
        <motion.span
          key={`${item.word}-${index}`}
          className={`inline-block ${item.className}`}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.85, delay: shouldReduceMotion ? 0 : delay + index * 0.08, ease: MOTION_EASE }}
        >
          {item.word}
          {index < words.length - 1 ? ' ' : null}
        </motion.span>
      ))}
    </div>
  );
}

function AnimatedLetter({
  char,
  index,
  total,
  progress
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const charProgress = index / total;
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1]);

  return (
    <motion.span style={{ opacity: shouldReduceMotion ? 1 : opacity }}>
      {char}
    </motion.span>
  );
}

function AnimatedParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2']
  });
  const chars = Array.from(text);

  return (
    <p ref={ref} className="mx-auto mt-8 max-w-3xl text-xs leading-[1.45] text-[#DEDBC8] sm:text-sm md:text-base">
      {chars.map((char, index) => (
        <AnimatedLetter
          key={`${char}-${index}`}
          char={char}
          index={index}
          total={Math.max(chars.length - 1, 1)}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}

function scrollToCurrentHash() {
  const hash = window.location.hash;

  if (!hash) {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  const target = document.getElementById(hash.slice(1));
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY;
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
  window.scrollTo({ top, behavior: 'auto' });
}

function useMountedHashScroll() {
  useLayoutEffect(() => {
    const frameId = window.requestAnimationFrame(scrollToCurrentHash);
    const timeoutIds = [120, 420, 820].map((delay) => window.setTimeout(scrollToCurrentHash, delay));

    return () => {
      window.cancelAnimationFrame(frameId);
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);
}

function PrismaHero() {
  const navItems = [
    { label: 'Our story', href: '#about' },
    { label: 'Collective', href: '#features' },
    { label: 'Workshops', href: '#features' },
    { label: 'Programs', href: '#features' },
    { label: 'Inquiries', href: '#features' }
  ];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="hero" className="min-h-screen bg-black p-4 md:p-6" style={{ color: PRIMARY_TEXT }}>
      <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl bg-black md:min-h-[calc(100vh-3rem)] md:rounded-[2rem]">
        <video
          className="absolute inset-0 size-full object-cover"
          src={PRISMA_HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        <div className="noise-overlay absolute inset-0 opacity-[0.7] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        <nav className="absolute left-1/2 top-0 z-30 -translate-x-1/2 rounded-b-2xl bg-black px-4 py-2 md:rounded-b-3xl md:px-8">
          <div className="flex items-center gap-3 whitespace-nowrap text-[10px] sm:gap-6 sm:text-xs md:gap-12 md:text-sm lg:gap-14">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition-colors"
                style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = PRIMARY_TEXT;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)';
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 z-20 grid items-end gap-8 px-5 pb-7 sm:px-7 md:grid-cols-12 md:px-8 md:pb-8 lg:px-10">
          <div className="md:col-span-8">
            <h1 className="font-medium leading-[0.85] text-[#E1E0CC]">
              <WordsPullUp
                text="Prisma"
                showAsterisk
                className="text-7xl sm:text-9xl md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[16rem]"
              />
            </h1>
          </div>

          <div className="grid gap-5 md:col-span-4 md:pb-3">
            <motion.p
              className="max-w-md text-xs leading-[1.2] text-primary/70 sm:text-sm md:text-base"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : 0.5, ease: MOTION_EASE }}
            >
              Prisma is a worldwide network of visual artists, filmmakers and storytellers bound not by place, status
              or labels but by passion and hunger to unlock potential through our unique perspectives.
            </motion.p>
            <motion.a
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-primary py-1 pl-6 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
              href="#about"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : 0.7, ease: MOTION_EASE }}
            >
              Join the lab
              <span className="grid size-9 place-items-center rounded-full bg-black transition-transform group-hover:scale-110 sm:size-10">
                <ArrowRight className="text-primary" size={18} strokeWidth={2} />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrismaAbout() {
  return (
    <section id="about" className="bg-black px-4 py-20 sm:px-6 md:py-28" style={{ color: PRIMARY_TEXT }}>
      <div className="mx-auto max-w-6xl rounded-lg bg-[#101010] px-5 py-20 text-center sm:px-8 md:py-28">
        <p className="mb-7 text-[10px] font-bold uppercase text-primary sm:text-xs">Visual arts</p>
        <h2 className="mx-auto max-w-3xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl">
          <WordsPullUpMultiStyle
            segments={[
              { text: 'I am Marcus Chen,', className: 'font-normal' },
              { text: 'a self-taught director.', className: 'font-serif italic' },
              {
                text: 'I have skills in color grading, visual effects, and narrative design.',
                className: 'font-normal'
              }
            ]}
          />
        </h2>
        <AnimatedParagraph text="Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals." />
      </div>
    </section>
  );
}

function VideoFeatureCard() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      className="relative min-h-[360px] overflow-hidden rounded-lg bg-[#212121] lg:h-[480px]"
      initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.9, delay: 0, ease: [0.22, 1, 0.36, 1] }}
    >
      <video
        className="absolute inset-0 size-full object-cover"
        src={FEATURE_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55" />
      <p className="absolute bottom-5 left-5 right-5 text-xl font-medium text-[#E1E0CC] sm:text-2xl">
        Your creative canvas.
      </p>
    </motion.article>
  );
}

function FeatureCard({ feature, delay }: { feature: FeatureSpec; delay: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      className="flex min-h-[360px] flex-col justify-between rounded-lg bg-[#212121] p-5 lg:h-[480px]"
      initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <img
          src={feature.icon}
          alt=""
          className="size-10 rounded-lg object-cover sm:size-12"
          loading="lazy"
          aria-hidden="true"
        />
        <div className="mt-10 flex items-end justify-between gap-4">
          <h3 className="text-2xl font-bold leading-none text-[#E1E0CC]">
            {feature.title}
            <span className="ml-2 align-top text-xs font-normal text-gray-500">{feature.index}</span>
          </h3>
        </div>
        <ul className="mt-8 grid gap-3">
          {feature.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-snug text-gray-400">
              <Check className="mt-0.5 shrink-0 text-primary" size={16} strokeWidth={2} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <a href="#features" className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary">
        Learn more
        <ArrowRight className="-rotate-45" size={17} strokeWidth={2} />
      </a>
    </motion.article>
  );
}

function PrismaFeatures() {
  const features: FeatureSpec[] = [
    {
      index: '01',
      title: 'Project Storyboard.',
      icon: STORYBOARD_ICON,
      items: ['Scene-by-scene planning', 'Shared visual references', 'Shot lists for every team', 'Creative approvals in flow']
    },
    {
      index: '02',
      title: 'Smart Critiques.',
      icon: CRITIQUES_ICON,
      items: ['AI-assisted visual analysis', 'Time-coded creative notes', 'Integrations with editing tools']
    },
    {
      index: '03',
      title: 'Immersion Capsule.',
      icon: IMMERSION_ICON,
      items: ['Notification silencing', 'Ambient soundscapes', 'Schedule syncing for deep work']
    }
  ];

  return (
    <section id="features" className="relative min-h-screen overflow-hidden bg-black px-4 py-20 sm:px-6 md:py-28">
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-4xl text-center text-xl font-normal leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
          <WordsPullUpMultiStyle
            segments={[{ text: 'Studio-grade workflows for visionary creators.', className: 'text-[#E1E0CC]' }]}
          />
          <div className="mt-1">
            <WordsPullUpMultiStyle
              segments={[{ text: 'Built for pure vision. Powered by art.', className: 'text-gray-500' }]}
              delay={0.25}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:grid-cols-4">
          <VideoFeatureCard />
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} delay={(index + 1) * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PrismaLanding() {
  useMountedHashScroll();

  return (
    <div className="min-h-screen bg-black">
      <PrismaHero />
      <PrismaAbout />
      <PrismaFeatures />
    </div>
  );
}

function PersonalHomepage() {
  useMountedHashScroll();

  const mouse = useRef<Point>({ x: -999, y: -999 });
  const smooth = useRef<Point>({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState<Point>({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };

    const updateCursor = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = window.requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = window.requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const navItems = [
    { label: '首页', href: '#personal' },
    { label: '方向', href: '#personal-focus' },
    { label: '项目', href: '#personal-work' },
    { label: '联系', href: '#personal-contact' }
  ];

  const focusItems = [
    {
      index: '01',
      title: '生成模型',
      copy: '关注文生图、去偏和模型行为，让想法落到可以复现实验的训练流程里。'
    },
    {
      index: '02',
      title: '研究工程',
      copy: '把论文阅读、实验脚本和结果记录整理成清晰、可追踪、能继续迭代的项目。'
    },
    {
      index: '03',
      title: '表达与工具',
      copy: '重视界面、文档和信息层级，让复杂主题更容易被理解、交流和复盘。'
    }
  ];

  const projects = [
    {
      label: 'Featured Project',
      title: 'Text-to-Image Debiasing',
      copy: '基于元学习思路的文生图去偏课程项目，包含 Meta UNet、SDXL 训练和测试脚本。',
      href: 'https://github.com/chilgod/text-to-image-debiasing'
    },
    {
      label: 'Research',
      title: '研究笔记与报告',
      copy: '持续整理论文阅读、课程报告和实验记录，保留从问题到结果的推理链路。',
      href: '#personal-contact'
    },
    {
      label: 'GitHub Profile',
      title: '代码与公开仓库',
      copy: '浏览更多公开代码、实验项目和后续更新。',
      href: 'https://github.com/chilgod'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#171b18]" style={{ fontFamily: "'Almarai', sans-serif" }}>
      <nav className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between border-b border-white/10 bg-black/25 px-4 py-3 backdrop-blur-md sm:px-5">
        <a href="#personal" className="flex items-center gap-2.5" aria-label="Letian Qi home">
          <PersonalLogoMark />
          <span className="text-lg font-semibold text-white sm:text-xl">Letian Qi</span>
        </a>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2 py-2 backdrop-blur-md md:flex">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                index === 0 ? 'text-white bg-white/20' : 'text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-100 md:inline-flex"
          href="mailto:zl620186@gmail.com"
        >
          Email
          <Mail size={16} strokeWidth={2} />
        </a>

        <button className="md:hidden text-white p-2" type="button" aria-label="Open navigation">
          <Menu size={26} strokeWidth={2} />
        </button>
      </nav>

      <main id="personal">
        <section className="relative w-full overflow-hidden bg-black" style={{ height: '100dvh' }}>
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
            style={{ backgroundImage: `url(${PERSONAL_BG_IMAGE_1})` }}
          />

          <RevealLayer image={PERSONAL_BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

          <div className="absolute inset-0 z-40 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.78)_100%)] pointer-events-none" />

          <div className="absolute left-0 right-0 top-[17%] z-50 flex flex-col items-center px-5 text-center pointer-events-none">
            <p
              className="hero-anim hero-fade mb-4 text-xs font-semibold uppercase text-white/70 sm:text-sm"
              style={{ animationDelay: '0.12s' }}
            >
              @chilgod
            </p>
            <h1 className="text-white leading-[0.92]" aria-label="Letian Qi">
              <span
                className="block font-serif italic font-normal text-6xl sm:text-8xl md:text-9xl hero-anim hero-reveal"
                style={{ animationDelay: '0.25s' }}
              >
                Letian
              </span>
              <span
                className="block font-normal text-6xl sm:text-8xl md:text-9xl -mt-1 hero-anim hero-reveal"
                style={{ animationDelay: '0.42s' }}
              >
                Qi
              </span>
            </h1>
            <p
              className="hero-anim hero-fade mt-6 max-w-[760px] text-base font-medium text-white/80 sm:text-xl"
              style={{ animationDelay: '0.58s' }}
            >
              AI / 生成模型 / 研究型工程实践
            </p>
          </div>

          <div
            className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[285px] z-50 hero-anim hero-fade"
            style={{ animationDelay: '0.72s' }}
          >
            <p className="text-sm text-white/80 leading-relaxed">
              关注人工智能、生成模型与研究型工程实践，把论文想法推进到可复现的代码、实验和表达。
            </p>
          </div>

          <div
            className="absolute bottom-8 left-5 right-5 z-50 flex max-w-full flex-col items-start gap-4 sm:bottom-20 sm:left-auto sm:right-10 sm:max-w-[315px] sm:gap-5 md:right-14 hero-anim hero-fade"
            style={{ animationDelay: '0.88s' }}
          >
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              我喜欢把复杂问题拆成可验证的实验、清晰的工具和能被继续讨论的材料。
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e8702a] px-7 py-3 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/30 active:scale-95"
                href="https://github.com/chilgod"
              >
                GitHub
                <Github size={17} strokeWidth={2} />
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                href="mailto:zl620186@gmail.com"
              >
                Email
                <Mail size={17} strokeWidth={2} />
              </a>
            </div>
          </div>
        </section>

        <section
          id="personal-focus"
          className="border-b border-[#d8ddd2] bg-[#eef2e9] px-5 py-20 sm:px-8 lg:px-14 lg:py-28"
        >
          <div className="mx-auto w-full max-w-6xl">
            <p className="mb-3 text-xs font-extrabold uppercase text-[#b76135] sm:text-sm">Focus</p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-none text-[#171b18] sm:text-5xl lg:text-6xl">
              近期关注
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {focusItems.map((item) => (
                <article
                  key={item.index}
                  className="min-h-[220px] rounded-lg border border-[#31523b]/20 bg-white/70 p-6 shadow-[0_1px_0_rgba(24,32,27,0.04)]"
                >
                  <span className="text-sm font-extrabold text-[#68476c]">{item.index}</span>
                  <h3 className="mt-8 text-xl font-semibold text-[#171b18]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5e665f]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="personal-work" className="bg-[#f6f4ef] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase text-[#b76135] sm:text-sm">Work</p>
              <h2 className="max-w-xl text-4xl font-semibold leading-none text-[#171b18] sm:text-5xl lg:text-6xl">
                项目入口
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5e665f]">
                这里先放公开项目、研究材料和 GitHub 入口，后续可以继续扩展成博客、简历或论文页面。
              </p>
            </div>
            <div className="grid gap-3">
              {projects.map((project, index) => (
                <a
                  key={project.title}
                  className={`group grid min-h-[118px] gap-2 rounded-lg border p-5 text-left no-underline transition-all hover:-translate-y-0.5 hover:border-[#b76135]/50 hover:shadow-[0_18px_50px_rgba(24,32,27,0.14)] ${
                    index === 0
                      ? 'border-[#31523b]/30 bg-gradient-to-br from-white to-[#f2f6ed]'
                      : 'border-[#d8ddd2] bg-white'
                  }`}
                  href={project.href}
                >
                  <span className="text-xs font-extrabold uppercase text-[#b76135]">{project.label}</span>
                  <span className="flex items-center justify-between gap-4 text-xl font-semibold text-[#171b18]">
                    {project.title}
                    <ArrowUpRight
                      className="shrink-0 text-[#5e665f] transition-colors group-hover:text-[#b76135]"
                      size={20}
                      strokeWidth={2}
                    />
                  </span>
                  <p className="m-0 max-w-2xl text-sm leading-relaxed text-[#5e665f]">{project.copy}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="personal-contact" className="bg-[#171b18] px-5 py-20 text-white sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase text-[#d99668] sm:text-sm">Contact</p>
              <h2 className="text-4xl font-semibold leading-none sm:text-5xl lg:text-6xl">保持联系</h2>
            </div>
            <div className="grid w-full gap-2 md:w-[360px]">
              <a
                className="flex items-center justify-between gap-4 border-b border-white/20 py-4 text-white/80 transition-colors hover:text-white"
                href="mailto:zl620186@gmail.com"
              >
                zl620186@gmail.com
                <Mail size={18} strokeWidth={2} />
              </a>
              <a
                className="flex items-center justify-between gap-4 border-b border-white/20 py-4 text-white/80 transition-colors hover:text-white"
                href="https://github.com/chilgod"
              >
                github.com/chilgod
                <Github size={18} strokeWidth={2} />
              </a>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 bg-[#f6f4ef] px-5 py-7 text-sm text-[#5e665f] sm:flex-row sm:justify-between sm:px-8 lg:px-14">
          <span>© 2026 Letian Qi</span>
          <span>Built for GitHub Pages</span>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash);
    };

    window.addEventListener('hashchange', updateHash);
    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  useEffect(() => {
    const scrollToHash = () => {
      if (!hash) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }

      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY;
      document.documentElement.scrollTop = top;
      document.body.scrollTop = top;
      window.scrollTo({ top, behavior: 'auto' });
    };

    const timeoutIds = [80, 260, 620].map((delay) => window.setTimeout(scrollToHash, delay));

    return () => {
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, [hash]);

  if (hash === '#personal' || hash.startsWith('#personal-')) {
    return <PersonalHomepage />;
  }

  return <PrismaLanding />;
}
