"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const FootprintPath = ({ pattern }: { pattern: "normal" | "parkinsonian" }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      pathLength: [0, 1],
      transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
    });
  }, [controls]);

  const pathVariants = {
    normal: "M10,50 Q25,0 50,100 Q75,0 90,50",
    parkinsonian: "M10,50 Q30,30 50,70 Q70,30 90,50",
  };

  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      className="stroke-primary stroke-2 fill-none"
    >
      <motion.path
        d={pathVariants[pattern]}
        animate={controls}
        strokeDasharray="0 1"
      />
    </svg>
  );
};

const GaitVisualization = ({
  pattern,
}: {
  pattern: "normal" | "parkinsonian";
}) => {
  const bodyVariants = {
    normal: {
      y: [0, -10, 0],
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
    parkinsonian: {
      y: [0, -5, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const legVariants = {
    normal: {
      left: {
        rotate: [-20, 20, -20],
        transition: { duration: 1, repeat: Infinity, ease: "linear" },
      },
      right: {
        rotate: [20, -20, 20],
        transition: { duration: 1, repeat: Infinity, ease: "linear" },
      },
    },
    parkinsonian: {
      left: {
        rotate: [-10, 10, -10],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      },
      right: {
        rotate: [10, -10, 10],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      },
    },
  };

  const armVariants = {
    normal: {
      left: {
        rotate: [30, -30, 30],
        transition: { duration: 1, repeat: Infinity, ease: "linear" },
      },
      right: {
        rotate: [-30, 30, -30],
        transition: { duration: 1, repeat: Infinity, ease: "linear" },
      },
    },
    parkinsonian: {
      left: {
        rotate: [10, -10, 10],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      },
      right: {
        rotate: [-10, 10, -10],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      },
    },
  };

  return (
    <div className="relative w-40 h-80">
      <motion.div
        className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2"
        variants={bodyVariants}
        animate={pattern}
      >
        {/* Body */}
        <div className="w-8 h-24 bg-primary rounded-full" />
        {/* Head */}
        <div className="w-12 h-12 bg-primary rounded-full -mt-14 ml-[-8px]" />
        {/* Arms */}
        <motion.div
          className="absolute top-0 left-0 w-2 h-20 bg-primary origin-top"
          variants={armVariants}
          animate="left"
        />
        <motion.div
          className="absolute top-0 right-0 w-2 h-20 bg-primary origin-top"
          variants={armVariants}
          animate="right"
        />
        {/* Legs */}
        <motion.div
          className="absolute bottom-[-96px] left-[14px] w-2 h-24 bg-primary origin-top"
          variants={legVariants}
          animate="left"
        />
        <motion.div
          className="absolute bottom-[-96px] right-[14px] w-2 h-24 bg-primary origin-top"
          variants={legVariants}
          animate="right"
        />
      </motion.div>
    </div>
  );
};

const RealTimeData = ({ pattern }: { pattern: "normal" | "parkinsonian" }) => {
  const [stepLength, setStepLength] = useState(70);
  const [stepTime, setStepTime] = useState(1);
  const [asymmetry, setAsymmetry] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pattern === "normal") {
        setStepLength((prev) => prev + (Math.random() * 2 - 1));
        setStepTime((prev) =>
          Math.max(0.8, Math.min(1.2, prev + (Math.random() * 0.1 - 0.05)))
        );
        setAsymmetry((prev) =>
          Math.max(0, Math.min(10, prev + (Math.random() * 2 - 1)))
        );
      } else {
        setStepLength((prev) =>
          Math.max(40, Math.min(60, prev + (Math.random() * 4 - 2)))
        );
        setStepTime((prev) =>
          Math.max(1.2, Math.min(1.8, prev + (Math.random() * 0.2 - 0.1)))
        );
        setAsymmetry((prev) =>
          Math.max(10, Math.min(30, prev + (Math.random() * 4 - 2)))
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [pattern]);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Step Length (cm)</span>
          <span className="text-sm font-medium">{stepLength.toFixed(1)}</span>
        </div>
        <Progress value={stepLength} max={100} />
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Step Time (s)</span>
          <span className="text-sm font-medium">{stepTime.toFixed(2)}</span>
        </div>
        <Progress value={(stepTime / 2) * 100} max={100} />
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Gait Asymmetry (%)</span>
          <span className="text-sm font-medium">{asymmetry.toFixed(1)}</span>
        </div>
        <Progress value={asymmetry} max={30} />
      </div>
    </div>
  );
};

const AnalysisGraph = ({ pattern }: { pattern: "normal" | "parkinsonian" }) => {
  const graphVariants = {
    normal: {
      d: "M0,50 Q25,0 50,50 Q75,100 100,50",
    },
    parkinsonian: {
      d: "M0,50 Q25,40 50,50 Q75,60 100,50",
    },
  };

  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      className="stroke-primary stroke-2 fill-none"
    >
      <motion.path
        initial="normal"
        animate={pattern}
        variants={graphVariants}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </svg>
  );
};

const PressurePlateHeatmap = ({
  pattern,
}: {
  pattern: "normal" | "parkinsonian";
}) => {
  const heatmapVariants = {
    normal: [
      { x: 25, y: 25, intensity: 0.8 },
      { x: 75, y: 75, intensity: 0.8 },
      { x: 25, y: 75, intensity: 0.6 },
      { x: 75, y: 25, intensity: 0.6 },
    ],
    parkinsonian: [
      { x: 40, y: 40, intensity: 0.9 },
      { x: 60, y: 60, intensity: 0.9 },
      { x: 40, y: 60, intensity: 0.7 },
      { x: 60, y: 40, intensity: 0.7 },
    ],
  };

  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      className="stroke-primary stroke-2"
    >
      <rect width="100" height="100" fill="#f0f0f0" />
      {heatmapVariants[pattern].map((point, index) => (
        <motion.circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={15}
          fill={`rgba(255, 0, 0, ${point.intensity})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        />
      ))}
    </svg>
  );
};

const AIAnalysis = ({ pattern }: { pattern: "normal" | "parkinsonian" }) => {
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pattern === "normal") {
        setConfidence((prev) => Math.min(99, prev + Math.random() * 5));
      } else {
        setConfidence((prev) => Math.max(70, prev - Math.random() * 5));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [pattern]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">AI Confidence</span>
        <span className="text-sm font-medium">{confidence.toFixed(1)}%</span>
      </div>
      <Progress value={confidence} max={100} />
      <div className="flex items-center space-x-2">
        {confidence > 90 ? (
          <CheckCircle2 className="text-green-500" />
        ) : (
          <AlertCircle className="text-yellow-500" />
        )}
        <span className="text-sm">
          {confidence > 90
            ? "High confidence in diagnosis"
            : "Further analysis recommended"}
        </span>
      </div>
    </div>
  );
};

export default function ComprehensiveGaitAnalysis() {
  const [currentPattern, setCurrentPattern] = useState<
    "normal" | "parkinsonian"
  >("normal");
  const [speed, setSpeed] = useState(1);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          Comprehensive Gait Analysis for Early Parkinson's Detection
        </CardTitle>
        <CardDescription>
          Explore our advanced system for early Parkinson's diagnosis through
          multi-faceted gait analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visualization" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="pressure">Pressure Map</TabsTrigger>
            <TabsTrigger value="ai">AI Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="visualization" className="space-y-4">
            <div className="flex justify-around w-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Gait Pattern</h3>
                <GaitVisualization pattern={currentPattern} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Footprint Pattern
                </h3>
                <FootprintPath pattern={currentPattern} />
              </div>
            </div>
            <div className="w-full space-y-2">
              <h3 className="text-lg font-semibold">Analysis Graph</h3>
              <AnalysisGraph pattern={currentPattern} />
            </div>
          </TabsContent>
          <TabsContent value="metrics" className="space-y-4">
            <h3 className="text-lg font-semibold">Real-time Gait Metrics</h3>
            <RealTimeData pattern={currentPattern} />
          </TabsContent>
          <TabsContent value="pressure" className="space-y-4">
            <h3 className="text-lg font-semibold">Pressure Plate Heatmap</h3>
            <div className="flex justify-center">
              <PressurePlateHeatmap pattern={currentPattern} />
            </div>
            <p className="text-sm text-center">
              This heatmap shows the pressure distribution during walking.
              {currentPattern === "normal"
                ? " Normal gait shows a more distributed pressure pattern."
                : " Parkinsonian gait often shows a more concentrated pressure pattern."}
            </p>
          </TabsContent>
          <TabsContent value="ai" className="space-y-4">
            <h3 className="text-lg font-semibold">AI-Powered Analysis</h3>
            <AIAnalysis pattern={currentPattern} />
          </TabsContent>
        </Tabs>
        <div className="mt-8 space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setCurrentPattern("normal")}
              variant={currentPattern === "normal" ? "default" : "outline"}
            >
              Normal Gait
            </Button>
            <Button
              onClick={() => setCurrentPattern("parkinsonian")}
              variant={
                currentPattern === "parkinsonian" ? "default" : "outline"
              }
            >
              Parkinsonian Gait
            </Button>
          </div>
          <div className="w-full space-y-2">
            <label htmlFor="speed-slider" className="text-sm font-medium">
              Animation Speed: {speed.toFixed(1)}x
            </label>
            <Slider
              id="speed-slider"
              min={0.5}
              max={2}
              step={0.1}
              value={[speed]}
              onValueChange={([value]) => setSpeed(value)}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md mx-auto">
            {currentPattern === "normal"
              ? "Normal gait exhibits a smooth, rhythmic pattern with larger steps, natural arm swings, and consistent timing."
              : "Parkinsonian gait typically shows shorter, shuffling steps, reduced arm swing, slower movement, and increased gait asymmetry."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
