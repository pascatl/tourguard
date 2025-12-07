import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { tourService } from "../services/api";
import { Tour } from "../types/api";
import {
	ArrowLeft,
	Save,
	MapPin,
	Clock,
	User,
	Phone,
	Upload,
} from "lucide-react";

interface TourFormData {
	name: string;
	description: string;
	start_location: string;
	end_location: string;
	planned_start_time: string;
	planned_end_time: string;
	emergency_contact_name: string;
	emergency_contact_phone: string;
}

const TourFormPage: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [existingTour, setExistingTour] = useState<Tour | null>(null);
	const [gpxFile, setGpxFile] = useState<File | null>(null);

	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = Boolean(id);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm<TourFormData>();

	useEffect(() => {
		if (isEdit && id) {
			loadTour(id);
		}
	}, [isEdit, id]);

	const loadTour = async (tourId: string) => {
		try {
			setIsLoading(true);
			const tour = await tourService.getTour(tourId);
			setExistingTour(tour);

			// Fill form with existing data
			reset({
				name: tour.name,
				description: tour.description || "",
				start_location: tour.start_location,
				end_location: tour.end_location || "",
				planned_start_time: new Date(tour.planned_start_time)
					.toISOString()
					.slice(0, 16),
				planned_end_time: new Date(tour.planned_end_time)
					.toISOString()
					.slice(0, 16),
				emergency_contact_name: tour.emergency_contact_name,
				emergency_contact_phone: tour.emergency_contact_phone,
			});
		} catch (error) {
			setError("Fehler beim Laden der Tour");
			console.error("Error loading tour:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const onSubmit = async (data: TourFormData) => {
		setIsLoading(true);
		setError("");

		try {
			const tourData = {
				...data,
				planned_start_time: new Date(data.planned_start_time).toISOString(),
				planned_end_time: new Date(data.planned_end_time).toISOString(),
			};

			let savedTour: Tour;
			if (isEdit && id) {
				savedTour = await tourService.updateTour(id, tourData);
			} else {
				savedTour = await tourService.createTour(tourData);
			}

			// Upload GPX file if provided
			if (gpxFile) {
				await tourService.uploadGPX(savedTour.id, gpxFile);
			}

			navigate(`/tours/${savedTour.id}`);
		} catch (error) {
			setError("Fehler beim Speichern der Tour");
			console.error("Error saving tour:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.name.toLowerCase().endsWith(".gpx")) {
			setGpxFile(file);
		} else {
			setError("Bitte wählen Sie eine gültige GPX-Datei aus.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between py-6">
						<div className="flex items-center">
							<button
								onClick={() => navigate("/dashboard")}
								className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600"
							>
								<ArrowLeft className="h-5 w-5" />
							</button>
							<h1 className="text-2xl font-bold text-gray-900">
								{isEdit ? "Tour bearbeiten" : "Neue Tour"}
							</h1>
						</div>
					</div>
				</div>
			</header>

			{/* Form */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-white shadow rounded-lg">
					<form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
						{error && (
							<div className="rounded-md bg-red-50 p-4">
								<div className="text-sm text-red-800">{error}</div>
							</div>
						)}

						{/* Basic Information */}
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="sm:col-span-2">
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700"
								>
									Tourname *
								</label>
								<input
									{...register("name", {
										required: "Tourname ist erforderlich",
									})}
									type="text"
									className="input-field mt-1"
									placeholder="z.B. Zugspitze über Höllental"
								/>
								{errors.name && (
									<p className="form-error">{errors.name.message}</p>
								)}
							</div>

							<div className="sm:col-span-2">
								<label
									htmlFor="description"
									className="block text-sm font-medium text-gray-700"
								>
									Beschreibung
								</label>
								<textarea
									{...register("description")}
									rows={3}
									className="input-field mt-1"
									placeholder="Kurze Beschreibung der Tour..."
								/>
							</div>
						</div>

						{/* Location */}
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div>
								<label
									htmlFor="start_location"
									className="block text-sm font-medium text-gray-700"
								>
									<MapPin className="inline h-4 w-4 mr-1" />
									Startpunkt *
								</label>
								<input
									{...register("start_location", {
										required: "Startpunkt ist erforderlich",
									})}
									type="text"
									className="input-field mt-1"
									placeholder="z.B. Hammersbach Parkplatz"
								/>
								{errors.start_location && (
									<p className="form-error">{errors.start_location.message}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="end_location"
									className="block text-sm font-medium text-gray-700"
								>
									<MapPin className="inline h-4 w-4 mr-1" />
									Endpunkt
								</label>
								<input
									{...register("end_location")}
									type="text"
									className="input-field mt-1"
									placeholder="z.B. Zugspitze Gipfel (optional)"
								/>
							</div>
						</div>

						{/* Time Planning */}
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div>
								<label
									htmlFor="planned_start_time"
									className="block text-sm font-medium text-gray-700"
								>
									<Clock className="inline h-4 w-4 mr-1" />
									Geplanter Start *
								</label>
								<input
									{...register("planned_start_time", {
										required: "Startzeit ist erforderlich",
									})}
									type="datetime-local"
									className="input-field mt-1"
								/>
								{errors.planned_start_time && (
									<p className="form-error">
										{errors.planned_start_time.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="planned_end_time"
									className="block text-sm font-medium text-gray-700"
								>
									<Clock className="inline h-4 w-4 mr-1" />
									Geplantes Ende *
								</label>
								<input
									{...register("planned_end_time", {
										required: "Endzeit ist erforderlich",
									})}
									type="datetime-local"
									className="input-field mt-1"
								/>
								{errors.planned_end_time && (
									<p className="form-error">
										{errors.planned_end_time.message}
									</p>
								)}
							</div>
						</div>

						{/* Emergency Contact */}
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Notfallkontakt
							</h3>
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div>
									<label
										htmlFor="emergency_contact_name"
										className="block text-sm font-medium text-gray-700"
									>
										<User className="inline h-4 w-4 mr-1" />
										Name *
									</label>
									<input
										{...register("emergency_contact_name", {
											required: "Notfallkontakt Name ist erforderlich",
										})}
										type="text"
										className="input-field mt-1"
										placeholder="z.B. Max Mustermann"
									/>
									{errors.emergency_contact_name && (
										<p className="form-error">
											{errors.emergency_contact_name.message}
										</p>
									)}
								</div>

								<div>
									<label
										htmlFor="emergency_contact_phone"
										className="block text-sm font-medium text-gray-700"
									>
										<Phone className="inline h-4 w-4 mr-1" />
										Telefonnummer *
									</label>
									<input
										{...register("emergency_contact_phone", {
											required: "Telefonnummer ist erforderlich",
											pattern: {
												value: /^[+]?[\d\s\-\(\)]+$/,
												message: "Ungültige Telefonnummer",
											},
										})}
										type="tel"
										className="input-field mt-1"
										placeholder="z.B. +49 123 456789"
									/>
									{errors.emergency_contact_phone && (
										<p className="form-error">
											{errors.emergency_contact_phone.message}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* GPX Upload */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								<Upload className="inline h-4 w-4 mr-1" />
								GPX-Datei hochladen (optional)
							</label>
							<input
								type="file"
								accept=".gpx"
								onChange={handleFileChange}
								className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
							/>
							{gpxFile && (
								<p className="mt-1 text-sm text-green-600">
									Ausgewählt: {gpxFile.name}
								</p>
							)}
						</div>

						{/* Actions */}
						<div className="flex justify-end space-x-3 pt-6 border-t">
							<button
								type="button"
								onClick={() => navigate("/dashboard")}
								className="btn-secondary"
							>
								Abbrechen
							</button>
							<button
								type="submit"
								disabled={isLoading}
								className="btn-primary flex items-center"
							>
								<Save className="h-4 w-4 mr-2" />
								{isLoading ? "Wird gespeichert..." : "Speichern"}
							</button>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
};

export default TourFormPage;
