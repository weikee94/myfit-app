import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";

const schema = z.object({
  full_name:    z.string().optional(),
  weight_kg:    z.number().positive().optional(),
  height_cm:    z.number().positive().optional(),
  ftp_watts:    z.number().positive().int().optional(),
  css_sec_100m: z.number().positive().int().optional(),
  lthr:         z.number().positive().int().optional(),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { data: profile }  = useProfile(user?.id ?? "");
  const updateProfile      = useUpdateProfile(user?.id ?? "");
  const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (profile) reset({
      full_name:    profile.full_name    ?? undefined,
      weight_kg:    profile.weight_kg    ?? undefined,
      height_cm:    profile.height_cm    ?? undefined,
      ftp_watts:    profile.ftp_watts    ?? undefined,
      css_sec_100m: profile.css_sec_100m ?? undefined,
      lthr:         profile.lthr         ?? undefined,
    });
  }, [profile, reset]);

  const onSubmit = async (data: FormData) => {
    await updateProfile.mutateAsync({
      full_name:    data.full_name    ?? null,
      weight_kg:    data.weight_kg    ?? null,
      height_cm:    data.height_cm    ?? null,
      ftp_watts:    data.ftp_watts    ?? null,
      css_sec_100m: data.css_sec_100m ?? null,
      lthr:         data.lthr         ?? null,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Profile</h2>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Account</CardTitle></CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm">{user?.email}</p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Personal</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input placeholder="Your name" {...register("full_name")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Weight (kg)</Label>
                <Input type="number" step="0.1" placeholder="70" {...register("weight_kg", { valueAsNumber: true })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Height (cm)</Label>
                <Input type="number" placeholder="175" {...register("height_cm", { valueAsNumber: true })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Triathlon Metrics</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>FTP (watts)</Label>
                <Input type="number" placeholder="220" {...register("ftp_watts", { valueAsNumber: true })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>LTHR (bpm)</Label>
                <Input type="number" placeholder="162" {...register("lthr", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>CSS (sec/100m)</Label>
              <Input type="number" placeholder="95" {...register("css_sec_100m", { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </form>

      <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}
