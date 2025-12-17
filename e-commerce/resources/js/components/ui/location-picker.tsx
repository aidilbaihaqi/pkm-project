import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from './button';

// Fix for default marker icon in Leaflet with Vite/Webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
    value?: { lat: number; lng: number };
    onChange: (value: { lat: number; lng: number }) => void;
    label?: string;
    error?: string;
}

function LocationMarker({ position, onChange }: { position: L.LatLng | null; onChange: (pos: L.LatLng) => void }) {
    const map = useMapEvents({
        click(e) {
            onChange(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

export function LocationPicker({ value, onChange, label = 'Pilih Lokasi Toko', error }: LocationPickerProps) {
    // Default center (Indonesia)
    const [position, setPosition] = useState<L.LatLng | null>(
        value ? new L.LatLng(value.lat, value.lng) : null
    );

    // Default view Jakarta if no position
    const defaultCenter = value
        ? [value.lat, value.lng] as [number, number]
        : [-6.2088, 106.8456] as [number, number];

    useEffect(() => {
        if (value) {
            setPosition(new L.LatLng(value.lat, value.lng));
        }
    }, [value]);

    const handleLocationChange = (latlng: L.LatLng) => {
        setPosition(latlng);
        onChange({ lat: latlng.lat, lng: latlng.lng });
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const newPos = new L.LatLng(latitude, longitude);
                    handleLocationChange(newPos);
                    // Note: We can't access map instance here easily to flyTo, 
                    // but the marker will update and user can see coords
                },
                (err) => {
                    console.error("Error getting location", err);
                    alert("Gagal mendapatkan lokasi saat ini. Pastikan GPS aktif.");
                }
            );
        } else {
            alert("Browser tidak mendukung geolocation");
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetCurrentLocation}
                    className="h-8 text-xs"
                >
                    <MapPin className="mr-2 h-3 w-3" />
                    Gunakan Lokasi Saya
                </Button>
            </div>

            <div className="relative h-[300px] w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
                <MapContainer
                    center={defaultCenter}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="h-full w-full z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} onChange={handleLocationChange} />
                </MapContainer>
            </div>

            {position && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Koordinat: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                </p>
            )}

            {error && (
                <p className="text-sm font-medium text-red-500 dark:text-red-900">{error}</p>
            )}
        </div>
    );
}
