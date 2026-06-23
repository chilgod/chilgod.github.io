import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue
} from 'framer-motion';
import { ArrowRight, ArrowUpRight, BookOpen, Github, Mail, Menu } from 'lucide-react';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';
const FEATURE_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';
const MOLECULE_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85';
const GENERATION_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85';
const WEIGHT_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85';

const PRIMARY_TEXT = '#E1E0CC';
const MOTION_EASE = [0.16, 1, 0.3, 1] as const;

type MultiStyleSegment = {
  text: string;
  className?: string;
};

type DirectionSpec = {
  index: string;
  title: string;
  english: string;
  image: string;
  problem: string;
  methods: string;
  status: string;
};

type PaperTrack = {
  title: string;
  english: string;
  accent: string;
  categories: {
    label: string;
    copy: string;
  }[];
};

type ProjectLink = {
  label: string;
  title: string;
  copy: string;
  href: string;
};

function scrollToCurrentHash() {
  const rawHash = window.location.hash;
  const hash = rawHash === '#personal' ? '#home' : rawHash;

  if (!hash) {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  const target = document.getElementById(hash.slice(1));
  if (!target) return;

  const top = target.offsetTop;
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

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#personal') {
        window.setTimeout(scrollToCurrentHash, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
}

function WordsPullUpMultiStyle({ segments, className = '', delay = 0 }: {
  segments: MultiStyleSegment[];
  className?: string;
  delay?: number;
}) {
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

  return <motion.span style={{ opacity: shouldReduceMotion ? 1 : opacity }}>{char}</motion.span>;
}

function AnimatedParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2']
  });
  const chars = Array.from(text);

  return (
    <p ref={ref} className="mx-auto mt-8 max-w-3xl text-sm leading-[1.6] text-[#DEDBC8]/80 md:text-base">
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

function DirectionCard({ direction, delay }: { direction: DirectionSpec; delay: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      className="group flex min-h-[420px] flex-col justify-between overflow-hidden rounded-lg bg-[#1e1e1e]"
      initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={direction.image}
          alt=""
          className="size-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
          loading="lazy"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-[#1e1e1e]/10 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-bold uppercase tracking-[0.28em] text-primary/70">{direction.index}</span>
        <h3 className="mt-6 text-2xl font-bold leading-none text-[#E1E0CC]">{direction.title}</h3>
        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/35">{direction.english}</p>
        <dl className="mt-8 grid gap-5 text-sm leading-relaxed text-gray-400">
          <div>
            <dt className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">核心问题</dt>
            <dd>{direction.problem}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">关注方法</dt>
            <dd>{direction.methods}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">整理状态</dt>
            <dd>{direction.status}</dd>
          </div>
        </dl>
      </div>
    </motion.article>
  );
}

function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const navItems = [
    { label: '首页', href: '#home' },
    { label: '方向', href: '#directions' },
    { label: '论文地图', href: '#papers' },
    { label: '项目', href: '#projects' },
    { label: '联系', href: '#contact' }
  ];

  return (
    <section id="home" className="min-h-screen bg-black p-4 md:p-6" style={{ color: PRIMARY_TEXT }}>
      <span id="personal" className="sr-only" aria-hidden="true" />
      <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl bg-black md:min-h-[calc(100vh-3rem)] md:rounded-[2rem]">
        <video
          className="absolute inset-0 size-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        <div className="noise-overlay absolute inset-0 opacity-[0.72] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70 pointer-events-none" />

        <nav className="absolute left-1/2 top-0 z-30 -translate-x-1/2 rounded-b-2xl bg-black px-3 py-2 md:rounded-b-3xl md:px-7">
          <div className="hidden items-center gap-7 whitespace-nowrap text-sm md:flex lg:gap-11">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-primary/75 transition-colors hover:text-primary">
                {item.label}
              </a>
            ))}
          </div>
          <button className="grid size-9 place-items-center text-primary md:hidden" type="button" aria-label="Open navigation">
            <Menu size={22} strokeWidth={2} />
          </button>
        </nav>

        <a
          className="absolute right-5 top-5 z-30 hidden items-center gap-2 rounded-full border border-primary/20 bg-black/40 px-4 py-2 text-sm font-medium text-primary backdrop-blur-md transition-colors hover:bg-primary hover:text-black md:inline-flex"
          href="mailto:zl620186@gmail.com"
        >
          Email
          <Mail size={16} strokeWidth={2} />
        </a>

        <div className="absolute bottom-0 left-0 right-0 z-20 grid items-end gap-8 px-5 pb-7 sm:px-7 md:grid-cols-12 md:px-8 md:pb-8 lg:px-10">
          <div className="md:col-span-8">
            <motion.p
              className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-primary/70 sm:text-sm"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : 0.2, ease: MOTION_EASE }}
            >
              @chilgod
            </motion.p>
            <h1 className="max-w-5xl font-medium leading-[0.86] text-[#E1E0CC]" aria-label="Letian Qi">
              <WordsPullUpMultiStyle
                segments={[
                  { text: 'Letian', className: 'font-serif italic' },
                  { text: 'Qi', className: 'font-normal' }
                ]}
                className="justify-start text-6xl sm:text-8xl md:text-[8.5rem] lg:text-[11rem] xl:text-[13rem]"
              />
            </h1>
          </div>

          <div className="grid gap-5 md:col-span-4 md:pb-3">
            <motion.p
              className="max-w-md text-sm leading-[1.35] text-primary/75 sm:text-base"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : 0.55, ease: MOTION_EASE }}
            >
              生成模型 / 分子结构生成 / 3D生成 / 权重空间生成
            </motion.p>
            <motion.p
              className="max-w-md text-xs leading-relaxed text-white/55 sm:text-sm"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : 0.68, ease: MOTION_EASE }}
            >
              整理论文、实验和研究问题，把分散的生成模型方向压缩成可以持续阅读、比较和复现的地图。
            </motion.p>
            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : 0.8, ease: MOTION_EASE }}
            >
              <a
                className="group inline-flex w-fit items-center gap-2 rounded-full bg-primary py-1 pl-6 pr-1 text-sm font-medium text-black transition-all hover:gap-3"
                href="#papers"
              >
                进入论文地图
                <span className="grid size-9 place-items-center rounded-full bg-black transition-transform group-hover:scale-110">
                  <ArrowRight className="text-primary" size={17} strokeWidth={2} />
                </span>
              </a>
              <a
                className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 px-5 py-2.5 text-sm font-medium text-primary/85 transition-colors hover:bg-primary hover:text-black"
                href="https://github.com/chilgod"
              >
                GitHub
                <Github size={16} strokeWidth={2} />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="bg-black px-4 py-20 sm:px-6 md:py-28" style={{ color: PRIMARY_TEXT }}>
      <div className="mx-auto max-w-6xl rounded-lg bg-[#101010] px-5 py-20 text-center sm:px-8 md:py-28">
        <p className="mb-7 text-[10px] font-bold uppercase tracking-[0.28em] text-primary sm:text-xs">Research archive</p>
        <h2 className="mx-auto max-w-4xl text-3xl leading-[0.98] sm:text-4xl sm:leading-[0.95] md:text-5xl lg:text-6xl">
          <WordsPullUpMultiStyle
            segments={[
              { text: '关注生成模型中的结构、几何与参数空间。', className: 'font-normal' },
              { text: '把论文整理成可复盘的研究路径。', className: 'font-serif italic' }
            ]}
          />
        </h2>
        <AnimatedParagraph text="这个主页第一版不是论文数据库，而是一个持续扩展的学术策展框架：每个方向先固定问题、方法、评估和开放问题的位置，后续再逐步补充真实论文、笔记、代码和实验复现。" />
      </div>
    </section>
  );
}

function Directions() {
  const directions: DirectionSpec[] = [
    {
      index: '01',
      title: '分子结构生成',
      english: 'Molecular Structure Generation',
      image: MOLECULE_IMAGE,
      problem: '如何在化学约束、三维构象和目标性质之间生成可用的分子结构。',
      methods: '扩散模型、流模型、等变网络、构象采样和性质条件生成。',
      status: '先建立阅读框架，后续补充基础模型、评测数据集和复现实验。'
    },
    {
      index: '02',
      title: '3D 生成',
      english: '3D Generative Models',
      image: GENERATION_IMAGE,
      problem: '如何从图像、文本或稀疏观测生成稳定、可编辑、几何一致的三维表示。',
      methods: 'NeRF / Gaussian Splatting、3D diffusion、重建-生成混合流程和多视角一致性。',
      status: '整理表示、生成范式和评估维度，保留跨任务比较空间。'
    },
    {
      index: '03',
      title: '权重空间生成',
      english: 'Weight-Space Generation',
      image: WEIGHT_IMAGE,
      problem: '如何把神经网络权重本身作为生成对象，理解模型族、初始化和权重分布。',
      methods: '权重空间建模、超网络、模型 zoo 表征、checkpoint interpolation 和神经函数分布。',
      status: '先梳理问题边界与术语，后续补论文、实验脚本和相关报告。'
    }
  ];

  return (
    <section id="directions" className="relative overflow-hidden bg-black px-4 py-20 sm:px-6 md:py-28">
      <div className="bg-noise absolute inset-0 opacity-[0.16] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary/70">Directions</p>
          <h2 className="text-3xl font-normal leading-tight text-[#E1E0CC] sm:text-4xl md:text-5xl">
            三条主线，分别指向结构、几何和模型参数本身。
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {directions.map((direction, index) => (
            <DirectionCard key={direction.title} direction={direction} delay={index * 0.14} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Papers() {
  const paperTracks: PaperTrack[] = [
    {
      title: '分子结构生成',
      english: 'Molecular Structure Generation',
      accent: 'text-[#9bd1a9]',
      categories: [
        { label: 'Foundations', copy: '基础表征、化学约束、构象生成和性质预测相关论文。' },
        { label: 'Methods', copy: '扩散、流、等变网络、条件生成和采样策略。' },
        { label: 'Evaluation', copy: '有效性、唯一性、多样性、稳定性和任务指标。' },
        { label: 'Open Questions', copy: '可合成性、目标条件可靠性、分布外泛化与实验闭环。' }
      ]
    },
    {
      title: '3D 生成',
      english: '3D Generative Models',
      accent: 'text-[#d9b36b]',
      categories: [
        { label: 'Foundations', copy: '三维表示、多视角几何、重建和生成任务定义。' },
        { label: 'Methods', copy: 'NeRF、Gaussian Splatting、3D diffusion 和文本到 3D。' },
        { label: 'Evaluation', copy: '几何质量、视角一致性、纹理质量、编辑性和效率。' },
        { label: 'Open Questions', copy: '可控性、物理一致性、数据偏差和跨表示迁移。' }
      ]
    },
    {
      title: '权重空间生成',
      english: 'Weight-Space Generation',
      accent: 'text-[#c7a4ff]',
      categories: [
        { label: 'Foundations', copy: '模型 zoo、权重表征、排列对称性和函数空间关系。' },
        { label: 'Methods', copy: '超网络、权重扩散、checkpoint 生成和模型族插值。' },
        { label: 'Evaluation', copy: '生成权重可训练性、下游性能、校准和跨架构泛化。' },
        { label: 'Open Questions', copy: '参数空间语义、规模化数据、架构条件和安全边界。' }
      ]
    }
  ];

  return (
    <section id="papers" className="bg-[#0a0a0a] px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary/70">Paper map</p>
            <h2 className="max-w-3xl text-4xl font-normal leading-[0.98] text-[#E1E0CC] sm:text-5xl md:text-6xl">
              论文地图先搭骨架，再慢慢填充真实阅读。
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
            第一版不虚构具体论文条目。每个方向先保留四个固定槽位：基础、方法、评估和开放问题，后续可以把论文、笔记、代码和复现实验挂到对应位置。
          </p>
        </div>

        <div className="grid gap-4">
          {paperTracks.map((track) => (
            <article key={track.title} className="rounded-lg border border-white/10 bg-[#151515] p-4 sm:p-5">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#E1E0CC]">{track.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/35">{track.english}</p>
                </div>
                <span className={`w-fit rounded-full border border-white/10 px-3 py-1 text-xs font-bold ${track.accent}`}>
                  待补充论文
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {track.categories.map((category) => (
                  <div key={category.label} className="min-h-[150px] rounded-lg border border-white/10 bg-black/30 p-4">
                    <BookOpen className="mb-5 text-primary/80" size={20} strokeWidth={2} />
                    <h4 className="text-lg font-semibold text-[#E1E0CC]">{category.label}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">{category.copy}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const shouldReduceMotion = useReducedMotion();
  const projects: ProjectLink[] = [
    {
      label: 'Featured Project',
      title: 'Text-to-Image Debiasing',
      copy: '基于元学习思路的文生图去偏课程项目，包含 Meta UNet、SDXL 训练和测试脚本。',
      href: 'https://github.com/chilgod/text-to-image-debiasing'
    },
    {
      label: 'Research Notes',
      title: '论文笔记与报告入口',
      copy: '为后续分子结构生成、3D 生成、权重空间生成的阅读笔记预留统一入口。',
      href: '#papers'
    },
    {
      label: 'GitHub Profile',
      title: '代码与公开仓库',
      copy: '浏览更多公开代码、实验项目和后续更新。',
      href: 'https://github.com/chilgod'
    }
  ];

  return (
    <section id="projects" className="relative min-h-screen overflow-hidden bg-black px-4 py-20 sm:px-6 md:py-28">
      <div className="bg-noise absolute inset-0 opacity-[0.14] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-4xl text-center text-2xl font-normal leading-tight text-[#E1E0CC] sm:text-3xl md:text-4xl">
          <WordsPullUpMultiStyle segments={[{ text: '从论文整理到可运行实验。', className: 'text-[#E1E0CC]' }]} />
          <div className="mt-1">
            <WordsPullUpMultiStyle
              segments={[{ text: '保留代码、报告和继续扩展的入口。', className: 'text-gray-500' }]}
              delay={0.25}
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <motion.article
            className="relative min-h-[360px] overflow-hidden rounded-lg bg-[#212121] lg:h-[480px]"
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/65" />
            <p className="absolute bottom-5 left-5 right-5 text-xl font-medium text-[#E1E0CC] sm:text-2xl">
              Research in progress.
            </p>
          </motion.article>

          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              className="group flex min-h-[360px] flex-col justify-between rounded-lg bg-[#212121] p-5 text-left no-underline transition-colors hover:bg-[#282828] lg:h-[480px]"
              href={project.href}
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : (index + 1) * 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary/70">{project.label}</span>
                <div className="mt-10 flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold leading-none text-[#E1E0CC]">{project.title}</h3>
                  <ArrowUpRight
                    className="shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    size={22}
                    strokeWidth={2}
                  />
                </div>
                <p className="mt-8 text-sm leading-relaxed text-gray-400">{project.copy}</p>
              </div>
              <span className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary">
                Open
                <ArrowRight className="-rotate-45" size={17} strokeWidth={2} />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-[#0f0f0f] px-4 py-20 text-[#E1E0CC] sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 rounded-lg border border-white/10 bg-[#171717] p-5 sm:p-8 md:grid-cols-[1fr_420px] md:items-end">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary/70">Contact</p>
          <h2 className="text-4xl font-normal leading-none sm:text-5xl md:text-6xl">保持联系</h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-400">
            欢迎交流生成模型、论文复现、研究工程和相关项目合作。
          </p>
        </div>
        <div className="grid gap-2">
          <a
            className="flex items-center justify-between gap-4 border-b border-white/15 py-4 text-primary/80 transition-colors hover:text-primary"
            href="mailto:zl620186@gmail.com"
          >
            zl620186@gmail.com
            <Mail size={18} strokeWidth={2} />
          </a>
          <a
            className="flex items-center justify-between gap-4 border-b border-white/15 py-4 text-primary/80 transition-colors hover:text-primary"
            href="https://github.com/chilgod"
          >
            github.com/chilgod
            <Github size={18} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}

function AcademicHomepage() {
  useMountedHashScroll();

  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <About />
      <Directions />
      <Papers />
      <Projects />
      <Contact />
      <footer className="flex flex-col gap-2 bg-black px-5 py-7 text-sm text-gray-500 sm:flex-row sm:justify-between sm:px-8 lg:px-14">
        <span>© 2026 Letian Qi</span>
        <span>Academic homepage for GitHub Pages</span>
      </footer>
    </div>
  );
}

export default function App() {
  return <AcademicHomepage />;
}
